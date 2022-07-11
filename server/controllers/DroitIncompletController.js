const con = require('./db');
exports.view = async (req, res) => {
      if (!req.session.loggedin && !req.session.lockScreen) {
            return res.redirect('/auth/login');
      } if (req.session.loggedin && req.session.lockScreen) {
            return res.redirect('/auth/lock_screen');
      } else {
            req.session.lockScreen = false;
            req.session.loggedin = true;
            req.session.current_url = req.url;
            let user = await actualizeUser(req.session);
            let A_S = await GetAS();
            let AS = await GetActiveAS();
            let list=await GetListe(AS,0);
            let ID_Niv=0;
            return res.render('Paiment/DroitIncomplet', { user, A_S, list,ID_Niv});
      }
}
exports.GetListFiltre = async (req, res) => {
    if (!req.session.loggedin && !req.session.lockScreen) {
          return res.redirect('/auth/login');
    } if (req.session.loggedin && req.session.lockScreen) {
          return res.redirect('/auth/lock_screen');
    } else {
          const { ID_Niv } = req.body;
          let user = await actualizeUser(req.session);
          let A_S = await GetAS();
            let AS = await GetActiveAS();
            let list=await GetListe(AS,ID_Niv);
            return res.render('Paiment/DroitIncomplet', { user, A_S, list,ID_Niv});
    }
}
exports.PayerResteDroit = async (req, res) => {
      if (!req.session.loggedin && !req.session.lockScreen) {
            return res.redirect('/auth/login');
      } if (req.session.loggedin && req.session.lockScreen) {
            return res.redirect('/auth/lock_screen');
      } else {
            const { Matr, date, av_Droit,ID_Niv } = req.body;
            let user = await actualizeUser(req.session);
            let A_S = await GetActiveAS();
            let IDJ = await GetLastID("journal_p", "ID_Journal");
            let str = "INSERT INTO `journal_p`(`ID_Journal`, `Paiement`, `Date_P`, `Argent`, `add_by`, `Mode_P`, `av_Droit`, `Droit_Sco`, `Id_AS`, `Matr`, `type`) VALUES ( " + (++IDJ) + ", 'Reste du droit', '" + date + "'," + av_Droit + ", '" + user.username + "', 'Direct','true','true'," + (A_S) + "," + (Matr) + ", 'INSCRIPTION');";
            con.query(str, async (err, rows) => {
                  if (err) {
                        let user = req.session.user;
                        console.log(err);
                        let A_S = await GetAS();
                        let AS = await GetActiveAS();
                        let list=await GetListe(AS,ID_Niv);
                        return res.render('Paiment/DroitIncomplet', { user, error: "Action échoué", A_S,list });
                  } else {
                        return res.redirect('/DroitIncommplet');
                  }
            });
      }
  }

  // Pour les Ecolages

  exports.viewECO = async (req, res) => {
      if (!req.session.loggedin && !req.session.lockScreen) {
            return res.redirect('/auth/login');
      } if (req.session.loggedin && req.session.lockScreen) {
            return res.redirect('/auth/lock_screen');
      } else {
            req.session.lockScreen = false;
            req.session.loggedin = true;
            req.session.current_url = req.url;
            let user = await actualizeUser(req.session);
            let A_S = await GetAS();
            let AS = await GetActiveAS();
            let list=await GetListeECO(AS,1,1);
            let ID_Niv=1;
            return res.render('Paiment/ControllerEcolage', { user, A_S, list,ID_Niv});
      }
}

  // Pour les Autres Frais Scolarité

  exports.viewFraisSco = async (req, res) => {
      if (!req.session.loggedin && !req.session.lockScreen) {
            return res.redirect('/auth/login');
      } if (req.session.loggedin && req.session.lockScreen) {
            return res.redirect('/auth/lock_screen');
      } else {
            req.session.lockScreen = false;
            req.session.loggedin = true;
            req.session.current_url = req.url;
            let user = await actualizeUser(req.session);
            let A_S = await GetAS();
            let AS = await GetActiveAS();
            let list=await GetListeECO(AS,1,1);
            let ID_Niv=1;
            return res.render('Paiment/ControllerAutreFrais', { user, A_S, list,ID_Niv});
      }
}
async function actualizeUser(session) {
    let promise = new Promise((resolve, reject) => {
          con.query('SELECT * FROM login WHERE id = ? ', [session.user.id],
                function (error, results, fields) {
                      if (error) {
                            console.log(error)
                      }
                      if (results.length > 0) {
                            const { password, ...user } = results[0];
                            session.user = user;
                            resolve(user);
                      }
                });
    });
    return await promise;
}

var GetAS = async function GetAS() {
    let promise = new Promise((resolve, reject) => {
          con.query('SELECT * FROM `a_s` ORDER BY Id_AS; ',
                function (error, results, fields) {
                      if (error) {
                            console.log(error)
                      }
                      if (results.length > 0) {
                            resolve(results);
                      } else resolve(null);
                });
    });
    return await promise;
}

async function GetActiveAS() {
    let str = "SELECT *  FROM active;";
    let promise = new Promise((resolve, reject) => {
          con.query(str,
                function (error, results, fields) {
                      if (error) {
                            console.log(error)
                      }
                      if (results.length > 0) {
                            if (results[0].A_S != null) {
                                  resolve(results[0].A_S);
                            } else resolve(0);
                      } else resolve(null);
                });
    });
    return await promise;
}
async function GetLastID(table, champ) {
      let str = "SELECT MAX(" + champ + ") as lastID FROM " + table + ";";
      let promise = new Promise((resolve, reject) => {
            con.query(str,
                  function (error, results, fields) {
                        if (error) {
                              console.log(error)
                        }
                        if (results.length > 0) {
                              if (results[0].lastID != null) {
                                    resolve(results[0].lastID);
                              } else resolve(0);
                        } else resolve(null);
                  });
      });
      return await promise;
}
async function GetListe(A_S,ID_Niv) {
    let str ;
    if(0 == Number(ID_Niv)){
        str = "SELECT etudiant.ID_Et,etudiant.Matr,etudiant.Nom,etudiant.Prenom,etudiant.Adresse,etudiant.ImgPath,observation.Label_Obs,inscrire.ID_Niv,inscrire.Ancien,SUM(journal_p.Argent) as avance FROM `etudiant`,`inscrire`,`observation`,`journal_p` WHERE (etudiant.Matr=inscrire.Matr) AND (observation.ID_Obs=etudiant.ID_Obs) AND (etudiant.Matr=journal_p.Matr) AND inscrire.Id_AS=" + A_S + " AND journal_p.av_Droit='true' AND journal_p.Droit_Sco='true' GROUP BY etudiant.Matr ORDER BY etudiant.Nom;";
    }else{
        str = "SELECT etudiant.ID_Et,etudiant.Matr,etudiant.Nom,etudiant.Prenom,etudiant.Adresse,etudiant.ImgPath,observation.Label_Obs,inscrire.ID_Niv,inscrire.Ancien,SUM(journal_p.Argent) as avance FROM `etudiant`,`inscrire`,`observation`,`journal_p` WHERE (etudiant.Matr=inscrire.Matr) AND (observation.ID_Obs=etudiant.ID_Obs) AND (etudiant.Matr=journal_p.Matr) AND inscrire.Id_AS=" + A_S + " AND inscrire.ID_Niv=" + ID_Niv + " AND journal_p.av_Droit='true' AND journal_p.Droit_Sco='true' GROUP BY etudiant.Matr ORDER BY etudiant.Nom;";
    }
let promise = new Promise((resolve, reject) => {
          con.query(str,
                function (error, results, fields) {
                      if (error) {
                            console.log(error)
                      }
                      if (results.length > 0) {
                            resolve(results);
                      } else resolve(null);
                });
    });
    return await promise;
}
async function GetListeECO(A_S,ID_Niv,ID_Classe) {
      let str ;
      str = "SELECT etudiant.ID_Et,etudiant.Matr,etudiant.Nom,etudiant.Prenom,etudiant.Adresse,etudiant.ImgPath,observation.Label_Obs,inscrire.ID_Niv,inscrire.Ancien,SUM(journal_p.Argent) as avance FROM `etudiant`,`inscrire`,`observation`,`journal_p` WHERE (etudiant.Matr=inscrire.Matr) AND (observation.ID_Obs=etudiant.ID_Obs) AND (etudiant.Matr=journal_p.Matr) AND inscrire.Id_AS=" + A_S + " AND inscrire.ID_Niv=" + ID_Niv + " AND journal_p.av_Droit='true' AND journal_p.Droit_Sco='true' GROUP BY etudiant.Matr ORDER BY etudiant.Nom;";
      
  let promise = new Promise((resolve, reject) => {
            con.query(str,
                  function (error, results, fields) {
                        if (error) {
                              console.log(error)
                        }
                        if (results.length > 0) {
                              resolve(results);
                        } else resolve(null);
                  });
      });
      return await promise;
  }