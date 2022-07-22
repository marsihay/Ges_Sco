const con = require('./db');
const {actualizeUser} = require('./Shared/Handyfunction');
exports.view = async (req, res) => {
      if (!req.session.loggedin && !req.session.lockScreen) {
            return res.redirect('/auth/login');
      } if (req.session.loggedin && req.session.lockScreen) {
            return res.redirect('/auth/lock_screen');
      } else {
            req.session.lockScreen = false;
            req.session.loggedin = true;
            req.session.current_url = req.url;
            let Matr= req.params.Matr;
            let user = await actualizeUser(req.session);
            let A_S = await GetAS();
            let AS = await GetActiveAS();
            let result= await GetMatrInfoSearch(Matr);
            let etudiant=result[0];
            let journal = await GetMatrJournal(Matr,AS);
            return res.render('Setting/ProfileEleve', { user, A_S , etudiant,journal});
      }
}
exports.viewParent = async (req, res) => {
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
          let role="";
          let list=await GetListe(AS,role);
          return res.render('Setting/Parent', { user, A_S,list,role });
    }
}
exports.GetListParent = async (req, res) => {
      if (!req.session.loggedin && !req.session.lockScreen) {
            return res.redirect('/auth/login');
      } if (req.session.loggedin && req.session.lockScreen) {
            return res.redirect('/auth/lock_screen');
      } else {
            const{role}=req.body;
            let user = await actualizeUser(req.session);
            let A_S = await GetAS();
            let AS = await GetActiveAS();
            let list=await GetListe(AS,role);
            return res.render('Setting/Parent', { user, A_S,list,role });
      }
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
async function GetListe(A_S,role) {
      let str ;
      if(role== "Tuteur"){
          str = "SELECT parent.ID_P,parent.Nom_P,parent.Prenom_P,parent.email,parent.Tel_1,parent.Tel_2,parent.Tel_3,parenté.Matr FROM `parent`,`parenté`,`etudiant`,`inscrire` WHERE (parent.ID_P=parenté.ID_P) AND (etudiant.Matr=parenté.Matr) AND (inscrire.Matr=etudiant.Matr) AND parenté.role='Tuteur' AND parenté.Matr IN (SELECT etudiant.Matr FROM `etudiant`,`inscrire`,`observation` WHERE (etudiant.Matr=inscrire.Matr) AND (observation.ID_Obs=etudiant.ID_Obs) AND inscrire.Id_AS=" + A_S + ") ORDER BY parent.Nom_P;";
      }else if(role== "Pere"){
            str = "SELECT parent.ID_P,parent.Nom_P,parent.Prenom_P,parent.email,parent.Tel_1,parent.Tel_2,parent.Tel_3,parenté.Matr FROM `parent`,`parenté`,`etudiant`,`inscrire` WHERE (parent.ID_P=parenté.ID_P) AND (etudiant.Matr=parenté.Matr) AND (inscrire.Matr=etudiant.Matr) AND parenté.role='Pere' AND parenté.Matr IN (SELECT etudiant.Matr FROM `etudiant`,`inscrire`,`observation` WHERE (etudiant.Matr=inscrire.Matr) AND (observation.ID_Obs=etudiant.ID_Obs) AND inscrire.Id_AS=" + A_S + ") ORDER BY parent.Nom_P;";
        }else if(role== "Mere"){
            str = "SELECT parent.ID_P,parent.Nom_P,parent.Prenom_P,parent.email,parent.Tel_1,parent.Tel_2,parent.Tel_3,parenté.Matr FROM `parent`,`parenté`,`etudiant`,`inscrire` WHERE (parent.ID_P=parenté.ID_P) AND (etudiant.Matr=parenté.Matr) AND (inscrire.Matr=etudiant.Matr) AND parenté.role='Mere' AND parenté.Matr IN (SELECT etudiant.Matr FROM `etudiant`,`inscrire`,`observation` WHERE (etudiant.Matr=inscrire.Matr) AND (observation.ID_Obs=etudiant.ID_Obs) AND inscrire.Id_AS=" + A_S + ") ORDER BY parent.Nom_P;";
        }else{
          str = "SELECT parent.ID_P,parent.Nom_P,parent.Prenom_P,parent.email,parent.Tel_1,parent.Tel_2,parent.Tel_3,parenté.Matr FROM `parent`,`parenté`,`etudiant`,`inscrire` WHERE (parent.ID_P=parenté.ID_P) AND (etudiant.Matr=parenté.Matr) AND (inscrire.Matr=etudiant.Matr) AND parenté.Matr IN (SELECT etudiant.Matr FROM `etudiant`,`inscrire`,`observation` WHERE (etudiant.Matr=inscrire.Matr) AND (observation.ID_Obs=etudiant.ID_Obs) AND inscrire.Id_AS=" + A_S + ") ORDER BY parent.Nom_P;";
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
  async function GetMatrInfoSearch(matr) {
      let promise = new Promise((resolve, reject) => {
            con.query('SELECT DISTINCT etudiant.Matr,etudiant.Nom,etudiant.Prenom,etudiant.Date_naissance,etudiant.Lieu_naissance,etudiant.Adresse,etudiant.ImgPath,observation.Label_Obs FROM etudiant,observation WHERE etudiant.ID_Obs=observation.ID_Obs AND etudiant.Matr=?; ',
                  [matr], function (error, results, fields) {
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
async function GetMatrJournal(matr,A_S) {
      let promise = new Promise((resolve, reject) => {
            con.query('SELECT * FROM `journal_p` where journal_p.Matr=? AND journal_p.Id_AS=? ORDER BY ID_Journal; ',
                  [matr,A_S], function (error, results, fields) {
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