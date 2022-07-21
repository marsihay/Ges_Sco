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
            return res.render('Setting/ProfileEleve', { user, A_S });
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