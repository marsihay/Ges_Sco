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
            return res.render('Paiment/eleveInsc', { user, A_S, list,ID_Niv});
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
            return res.render('Paiment/eleveInsc', { user, A_S, list,ID_Niv});
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
async function GetListe(A_S,ID_Niv) {
    let str ;
    if(0 == Number(ID_Niv)){
        str = "SELECT etudiant.ID_Et,etudiant.Matr,etudiant.Nom,etudiant.Prenom,etudiant.Adresse,etudiant.ImgPath,observation.Label_Obs,inscrire.ID_Niv,inscrire.Date_insc FROM `etudiant`,`inscrire`,`observation` WHERE (etudiant.Matr=inscrire.Matr) AND (observation.ID_Obs=etudiant.ID_Obs) AND inscrire.Id_AS=" + A_S + " ORDER BY etudiant.Nom;";
    }else{
        str = "SELECT etudiant.ID_Et,etudiant.Matr,etudiant.Nom,etudiant.Prenom,etudiant.Adresse,etudiant.ImgPath,observation.Label_Obs,inscrire.ID_Niv,inscrire.Date_insc FROM `etudiant`,`inscrire`,`observation` WHERE (etudiant.Matr=inscrire.Matr) AND (observation.ID_Obs=etudiant.ID_Obs) AND inscrire.Id_AS=" + A_S + " AND inscrire.ID_Niv=" + ID_Niv + " ORDER BY etudiant.Nom;";
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