const con = require('./db');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const storage = multer.diskStorage({
      destination: (req, file, callBack) => {
            callBack(null, 'uploads')
      },
      filename: (req, file, callBack) => {
            //callBack(null, `User_${file.originalname}`)
            callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
      }
})
const upload = multer({ storage: storage })
// home 
exports.HomeRedirect = async (req, res) => {
      return res.redirect('/home');
}
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
            return res.render('home', { user, A_S });
      }
}

exports.userProfile = async (req, res) => {
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
            return res.render('auth/profile', { user, A_S });
      }
}

exports.EditProfile = async (req, res) => {
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
            return res.render('auth/profileEdit', { user, A_S });
      }
}

exports.SaveEditProfile = async (req, res) => {
      const files = req.files;
      //console.log(files);
      if (!files) {
            console.log("NO files");
      }

      if (files.profile) {
            Pth = "uploads/" + files.profile[0].filename;
            con.query('UPDATE login SET path=? WHERE email=?',
                  [Pth, req.session.user.email],
                  function (error, results) {
                        if (error) { return res.status(400).send(error); }
                        else {
                              console.log("vita Profile")
                        }
                  });
      }
      if (files.uploadcover) {
            Pth = "uploads/" + files.uploadcover[0].filename;
            con.query('UPDATE login SET CoverPhoto=? WHERE email=?',
                  [Pth, req.session.user.email],
                  function (error, results) {
                        if (error) { return res.status(400).send(error); }
                        else {
                              console.log("vita Cover")
                        }
                  });
      }

      return res.redirect("/profileEdit");
}

exports.SaveEditProfileInfo = (req, res) => {
      if (req.session.loggedin) {
            const data = req.body;
            con.query('UPDATE login SET username = ?, email = ?, fonction = ? WHERE id = ?',
                  [data.username, data.email, data.fonction, data.id], async (err, rows) => {

                        if (!err) {
                              return res.redirect("/profileEdit");
                        } else {
                              console.log(err);
                              let user = await actualizeUser(req.session);
                              let A_S = await GetAS();
                              return res.render('auth/profileEdit', { user, A_S, error: "Modification ??chou??." });
                        }
                  });
      } else return res.redirect('/auth/login');
}

exports.SaveEditProfilePassW = (req, res) => {
      if (req.session.loggedin) {
            const data = req.body;
            con.query('SELECT * FROM login WHERE id = ? ', [data.id],
                  async function (error, results, fields) {
                        if (error) {
                              let user = req.session.user;
                              let A_S = await GetAS();
                              return res.render('auth/profileEdit', { user, A_S, errorPW: error });
                        }
                        if (results.length > 0) {
                              if (!await bcrypt.compare(data.oldpassword, results[0].password)) {
                                    let user = req.session.user;
                                    let A_S = await GetAS();
                                    return res.render('auth/profileEdit', { user, A_S, errorPW: 'Ancien Mot de passe incorrect' });
                              } else {
                                    if (data.newpassword !== data.confirmpassword) {
                                          let user = req.session.user;
                                          let A_S = await GetAS();
                                          return res.render('auth/profileEdit', { OldPW: data.oldpassword, user, A_S, errorPW: 'Les deux mot de passe ne sont pas identique.' });
                                    } else {
                                          const salt = await bcrypt.genSalt(10);
                                          const hashedPassword = await bcrypt.hash(data.newpassword, salt);
                                          con.query('UPDATE login SET password = ? WHERE id = ?',
                                                [hashedPassword, data.id], async (err, rows) => {
                                                      if (!err) {
                                                            let user = await actualizeUser(req.session);
                                                            let A_S = await GetAS();
                                                            return res.render('auth/profileEdit', { user, A_S, SuccessPW: "Modification r??ussi." });
                                                      } else {
                                                            console.log(err);
                                                            let user = await actualizeUser(req.session);
                                                            let A_S = await GetAS();
                                                            return res.render('auth/profileEdit', { user, A_S, errorPW: "Modification ??chou??." });
                                                      }
                                                });
                                    }
                              }
                        } else {
                              return res.render('Auth/lock_screen', { error: 'Incorrect Email', userLocked: req.session.user });
                        }
                  });
      } else return res.redirect('/auth/login');
}

exports.GetAllActif = async (req, res) => {
      let list = await GetListActif();
      return res.send(list);
}
exports.GestAllInactif = async (req, res) => {
      let list = await GetListInactif();
      return res.send(list);
}
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

