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
            let ID_C=1;
            let ID_Eco=1;
            let list=await GetListeECO(AS,ID_C,ID_Eco);
            return res.render('Paiment/ControllerEcolage', { user, A_S, list,ID_C,ID_Eco});
      }
}
exports.GetListECOFiltre = async (req, res) => {
      if (!req.session.loggedin && !req.session.lockScreen) {
            return res.redirect('/auth/login');
      } if (req.session.loggedin && req.session.lockScreen) {
            return res.redirect('/auth/lock_screen');
      } else {
            const { ID_C, ID_Eco } = req.body;
            let user = await actualizeUser(req.session);
            let A_S = await GetAS();
              let AS = await GetActiveAS();
              let list=await GetListeECO(AS,ID_C,ID_Eco);
              return res.render('Paiment/ControllerEcolage', { user, A_S, list,ID_C,ID_Eco});
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
            let ID_C=1;
            let ID_autre=1;
            let list=await GetListeFS(AS,ID_C,ID_autre);
            return res.render('Paiment/ControllerAutreFrais', { user, A_S, list,ID_C,ID_autre});
      }
}
exports.GetListFSFiltre = async (req, res) => {
      if (!req.session.loggedin && !req.session.lockScreen) {
            return res.redirect('/auth/login');
      } if (req.session.loggedin && req.session.lockScreen) {
            return res.redirect('/auth/lock_screen');
      } else {
            const { ID_C, ID_autre } = req.body;
            let user = await actualizeUser(req.session);
            let A_S = await GetAS();
              let AS = await GetActiveAS();
              let list=await GetListeFS(AS,ID_C,ID_autre);
              return res.render('Paiment/ControllerAutreFrais', { user, A_S, list,ID_C,ID_autre});
      }
  }
exports.GetMoisList = async (req, res) => {
      let list = await GetMois();
      return res.send(list);
}
exports.GetFSList = async (req, res) => {
      let list = await GetFS();
      return res.send(list);
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
async function GetListeECO(A_S,ID_C,ID_Eco) {
      let str ;
      str = "SELECT DISTINCT etudiant.ID_Et,etudiant.Matr,etudiant.Nom,etudiant.Prenom,etudiant.Adresse,etudiant.ImgPath,observation.Label_Obs,inscrire.ID_Niv,inscrire.Ancien,appartenir.Num FROM `etudiant`,`inscrire`,`appartenir`,`observation`,`classe` WHERE (etudiant.Matr=inscrire.Matr) AND (etudiant.Matr=appartenir.Matr) AND (appartenir.ID_C=classe.ID_C) AND  (observation.ID_Obs=etudiant.ID_Obs) AND inscrire.Id_AS=" + A_S + " AND appartenir.Id_AS=" + A_S + " AND appartenir.ID_C=" + ID_C + " AND etudiant.Matr Not In (SELECT DISTINCT etudiant.Matr from etudiant,payer_eco,mois_ecolage where etudiant.Matr=payer_eco.Matr and mois_ecolage.ID_Eco=payer_eco.ID_Eco and mois_ecolage.ID_Eco=" + ID_Eco + " AND payer_eco.Id_AS=" + A_S + ") ORDER BY appartenir.Num;";
      
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
  async function GetMois() {
      let AS = await GetActiveAS();
      let promise = new Promise((resolve, reject) => {
            con.query('SELECT * FROM `mois_ecolage` WHERE Id_AS = ? ORDER BY ID_Eco; ',
                  [AS], function (error, results, fields) {
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
async function GetFS() {
      let AS = await GetActiveAS();
      let promise = new Promise((resolve, reject) => {
            con.query('SELECT * FROM `autres_fs` WHERE Id_AS = ? ORDER by ID_autre; ',
                  [AS], function (error, results, fields) {
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
async function GetListeFS(A_S,ID_C,ID_autre) {
      let str ;
      str = "SELECT DISTINCT etudiant.ID_Et,etudiant.Matr,etudiant.Nom,etudiant.Prenom,etudiant.Adresse,etudiant.ImgPath,observation.Label_Obs,inscrire.ID_Niv,inscrire.Ancien,appartenir.Num FROM `etudiant`,`inscrire`,`appartenir`,`observation`,`classe` WHERE (etudiant.Matr=inscrire.Matr) AND (etudiant.Matr=appartenir.Matr) AND (appartenir.ID_C=classe.ID_C) AND  (observation.ID_Obs=etudiant.ID_Obs) AND inscrire.Id_AS="+A_S+" AND appartenir.Id_AS="+A_S+" AND appartenir.ID_C="+ID_C+" and etudiant.Matr Not In (SELECT DISTINCT etudiant.Matr from etudiant,payer_autre,autres_fs where etudiant.Matr=payer_autre.Matr and autres_fs.ID_autre=payer_autre.id_Autre and autres_fs.ID_autre="+ID_autre+" AND payer_autre.Id_AS="+A_S+") ORDER BY appartenir.Num;";

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