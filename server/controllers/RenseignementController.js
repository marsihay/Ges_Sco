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
            let result= await GetMatrInfoSearch(Matr,AS);
            let etudiant=result[0];
            let journal = await GetMatrJournal(Matr,AS);
            let parent= await GetET_Parent(Matr);
            let CammaradeCL= await GetET_Camarade(Matr,AS);
            return res.render('Setting/ProfileEleve', { user, A_S , etudiant,journal,parent,CammaradeCL});
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
  exports.updateParent = (req, res) => {
      console.log(req.body);
      const { ID_P,Nom_P, Prenom_P,email,Tel_1,Tel_2,Tel_3 } = req.body;
      // User the connection
      con.query('UPDATE `parent` SET Nom_P=?,Prenom_P=?,email=?,Tel_1=?,Tel_2=?,Tel_3=? WHERE ID_P=?;',
            [Nom_P,Prenom_P,email,Tel_1,Tel_2,Tel_3,ID_P], async (err, rows) => {
                  if (err) {
                        console.log(err);
                        let user = req.session.user;
                        let A_S = await GetAS();
                        return res.render('Setting/Parent', { user, A_S, error: "Modification échoué" });
                  } else {
                        return res.redirect('/parentListe');
                  }
            });
}

exports.delParent = async (req, res) => {
      const { ID_P } = req.body;
      let str='';
      str+="DELETE FROM `parent` WHERE ID_P=" +ID_P+ ";";
      str+="DELETE FROM `parenté` WHERE ID_P=" +ID_P+ ";";
      // User the connection
      con.query(str, async (err, rows) => {
                  if (err) {
                        let user = req.session.user;
                        console.log(err);
                        let A_S = await GetAS();
                        return res.render('Setting/Parent', { user, A_S, error: "Suppression échoué" });
                  } else {
                        return res.redirect('/parentListe');
                  }
            });
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
  async function GetMatrInfoSearch(matr,A_S) {
      let promise = new Promise((resolve, reject) => {
            con.query('SELECT DISTINCT etudiant.Matr,etudiant.Nom,etudiant.Prenom,etudiant.Date_naissance,etudiant.Lieu_naissance,etudiant.Adresse,etudiant.ImgPath,observation.Label_Obs,classe.Label_C FROM etudiant,observation,classe,appartenir WHERE (etudiant.ID_Obs=observation.ID_Obs) AND (appartenir.ID_C=classe.ID_C) AND etudiant.Matr=? AND appartenir.ID_C IN (SELECT ID_C FROM appartenir WHERE Matr=? AND Id_AS=?); ',
                  [matr,matr,A_S], function (error, results, fields) {
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
async function GetET_Parent(matr) {
      let promise = new Promise((resolve, reject) => {
            con.query('SELECT * FROM parenté,parent WHERE (parenté.ID_P=parent.ID_P) AND parenté.Matr=?; ',
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
async function GetET_Camarade(matr,A_S) {
      let promise = new Promise((resolve, reject) => {
            con.query('SELECT * FROM appartenir, etudiant, observation, classe WHERE (appartenir.Matr=etudiant.Matr) AND (etudiant.ID_Obs=observation.ID_Obs) AND (classe.ID_C=appartenir.ID_C) AND appartenir.ID_C IN (SELECT ID_C FROM appartenir WHERE Matr=? AND Id_AS=?) ORDER BY appartenir.Num; ',
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