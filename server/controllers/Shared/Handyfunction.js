const con = require('./../db');
var actualizeUser = async function actualizeUser(session) {
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
async function GetAS() {
    let promise = new Promise((resolve, reject) => {
          con.query('SELECT * FROM `a_s` ORDER BY Id_AS; ',
                function (error, results, fields) {
                      if (error) {
                            console.log(error)
                      }
                      if (results.length > 0) {
                            resolve(results);
                      } else resolve("VIDE");
                });
    });
    return await promise;
}
async function GetListActif() {
    let A_S = await GetActiveAS();
    let promise = new Promise((resolve, reject) => {
          con.query('SELECT DISTINCT etudiant.Matr,etudiant.Nom,etudiant.Prenom,etudiant.Date_naissance,etudiant.Lieu_naissance,etudiant.Adresse,etudiant.ImgPath,observation.Label_Obs FROM etudiant,observation,inscrire WHERE etudiant.Matr=inscrire.Matr AND etudiant.ID_Obs=observation.ID_Obs AND etudiant.Matr IN (SELECT  etudiant.Matr FROM `etudiant`,`inscrire`,`observation` WHERE (etudiant.Matr=inscrire.Matr) AND (observation.ID_Obs=etudiant.ID_Obs) AND inscrire.Id_AS=?) ORDER BY etudiant.Nom;',
                [A_S], function (error, results, fields) {
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
async function GetListInactif() {
    let A_S = await GetActiveAS();
    let promise = new Promise((resolve, reject) => {
          con.query('SELECT DISTINCT etudiant.Matr,etudiant.Nom,etudiant.Prenom,etudiant.Date_naissance,etudiant.Lieu_naissance,etudiant.Adresse,etudiant.ImgPath,observation.Label_Obs FROM etudiant,observation,inscrire WHERE etudiant.ID_Obs=observation.ID_Obs AND etudiant.Matr NOT IN (SELECT  etudiant.Matr FROM `etudiant`,`inscrire`,`observation` WHERE (etudiant.Matr=inscrire.Matr) AND (observation.ID_Obs=etudiant.ID_Obs) AND inscrire.Id_AS=?) ORDER BY etudiant.Nom;',
                [A_S], function (error, results, fields) {
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
module.exports.actualizeUser = actualizeUser;