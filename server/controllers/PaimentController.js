const con = require('./db');
const bcrypt = require('bcryptjs');
// Cahier Journalier view 
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
            let date = new Date();
            let dd = "" + date.getDate();
            if (parseInt(dd) < 10) { dd = "0" + dd; }
            let mm = "" + (date.getMonth() + 1);
            if (parseInt(mm) < 10) { mm = "0" + mm; }
            let formatDate = dd + "-" + mm + "-" + date.getFullYear();
            let Jr = await GetJournal(formatDate, AS);
            let AutreFS = await GetAutreFS(AS);
            return res.render('Paiment/CahierJr', { user, A_S, Jr, AutreFS });
      }
}
exports.GetJournalierView = async (req, res) => {
      if (!req.session.loggedin && !req.session.lockScreen) {
            return res.redirect('/auth/login');
      } if (req.session.loggedin && req.session.lockScreen) {
            return res.redirect('/auth/lock_screen');
      } else {
            const { date } = req.body;
            let user = await actualizeUser(req.session);
            let A_S = await GetAS();
            let AS = await GetActiveAS();
            let Jr = await GetJournal(date, AS);
            let AutreFS = await GetAutreFS(AS);
            return res.render('Paiment/CahierJr', { user, A_S, Jr, date, AutreFS });
      }
}
exports.Inscrire = async (req, res) => {
      const data = req.body;
      let user = await actualizeUser(req.session);
      let A_S = await GetActiveAS();
      let IDJ = await GetLastID("journal_p", "ID_Journal");
      let paye = (data.av_Droit != 'avance') ? true : false;
      let EcoVal = [];
      let str = '';
      str += "INSERT INTO `inscrire`(`Matr`, `Id_AS`, `ID_Niv`, `Date_insc`, `Ancien`, `paye`) VALUES ( " + (data.Matr) + ", " + (A_S) + ", '" + data.ID_Niv + "','" + data.Date_insc + "', '" + data.Ancien + "', '" + paye + "');";
      let PayementText;
      if (paye) {
            PayementText = 'Droit ';
      } else {
            PayementText = 'Avance Droit ';
      }
      if (data.Ancien == "false") {
            let ID = await GetLastID("etudiant", "ID_Et");
            str += "INSERT INTO `etudiant`(`Matr`, `ID_Et`, `Nom`, `Prenom`, `Adresse`, `ImgPath`, `ID_Obs`) VALUES ( " + (data.Matr) + ", " + (++ID) + ", '" + data.Nom + "', '" + data.Prenom + "', '" + data.Adresse + "', '', " + data.ID_Obs + ");";
      }
      let i = 1;
      while (i <= Number(data.Nb_Eco)) {
            con.query('INSERT INTO `payer_eco`(`Matr`, `ID_Eco`, `Id_AS`, `Date_Paiement`) VALUES ( ?, ?, ?, ?) ',
                  [data.Matr, i, A_S, data.Date_insc], async function (error, results, fields) {
                        if (error) {
                              console.log(error);
                        } else {

                        }

                  });
            let results = await SelectMois(A_S, i);
            PayementText += " + " + results.Label_Eco;
            EcoVal.push([i]);
            i++;
      }
      if (data.pere == 'Pere') {
            let res = await InsertParent(data.Matr, data.pere, data.Nom_Pere, data.Prenom_Pere, data.email_Pere, data.Tel_1pere, data.Tel_2pere, data.Tel_3pere);
            console.log(res);
      }
      if (data.mere == 'Mere') {
            let res = await InsertParent(data.Matr, data.mere, data.Nom_mere, data.Prenom_mere, data.email_mere, data.Tel_1mere, data.Tel_2mere, data.Tel_3mere);
            console.log(res);
      }
      if (data.tuteur == 'Tuteur') {
            let res = await InsertParent(data.Matr, data.tuteur, data.Nom_T, data.Prenom_T, data.email_T, data.Tel_1T, data.Tel_2T, data.Tel_3T);
            console.log(res);
      }
      str += "INSERT INTO `journal_p`(`ID_Journal`, `Paiement`, `Date_P`, `Argent`, `add_by`, `Mode_P`, `av_Droit`, `Droit_Sco`, `ID_Ecolage`, `Id_AS`, `Matr`, `type`) VALUES ( " + (++IDJ) + ", '" + PayementText + "', '" + data.Date_insc + "'," + data.Argent + ", '" + user.username + "', 'Direct','" + (!paye) + "','true','" + [EcoVal] + "'," + (A_S) + "," + (data.Matr) + ", 'INSCRIPTION');";
      con.query(str, async (err, rows) => {
            if (err) {
                  let user = req.session.user;
                  console.log(err);
                  let A_S = await GetAS();
                  return res.render('Paiment/CahierJr', { user, error: "Modification échoué", A_S });
            } else {
                  return res.redirect('/cahierJr');
            }
      });
}
exports.GetOBS = async (req, res) => {
      let niveau = await GetOBS();
      return res.send(niveau);
}
exports.GetMatriculeInfo = async (req, res) => {
      let matr = req.params.MATR;
      let info = await GetMatrInfo(matr);
      return res.send(info);
}
exports.GetMatriculeInfoPaimentECO = async (req, res) => {
      let matr = req.params.MATR;
      let info = await GetMatrInfoPaiementECO(matr);
      return res.send(info);
}
exports.GetMatriculeInfoPaimentFS = async (req, res) => {
      let matr = req.params.MATR;
      let info = await GetMatrInfoPaiementFS(matr);
      return res.send(info);
}
exports.GetLastMatricule = async (req, res) => {
      let ID = await GetLastID("etudiant", "Matr");
      return res.send("" + (ID + 1));
}
exports.GetFraisPrix = async (req, res) => {
      let A_S = await GetActiveAS();
      const { type, ID_Niv } = req.body;
      let results = await GetPriceDroit(A_S, type, ID_Niv);
      return res.send(results);
}
exports.GetFraisScoPrix = async (req, res) => {
      let A_S = await GetActiveAS();
      const { ID_Niv } = req.body;
      let results = await GetPrice(A_S, ID_Niv);
      return res.send(results);
}
exports.GetAutrePrix = async (req, res) => {
      let A_S = await GetActiveAS();
      let results = await GetAutreFS(A_S);
      return res.send(results);
}
exports.PayerEcolage = async (req, res) => {
      const data = req.body;
      let user = await actualizeUser(req.session);
      let A_S = await GetActiveAS();
      let IDJ = await GetLastID("journal_p", "ID_Journal");
      let LastID_Eco = Number(await GetLastIDwith_AS("payer_eco", "ID_Eco", data.Matr));
      let EcoVal = [];
      let str = '';
      let i = 1;
      let PayementText = '';
      while (i <= Number(data.Nb_Eco)) {
            let Eco = LastID_Eco + i;
            con.query('INSERT INTO `payer_eco`(`Matr`, `ID_Eco`, `Id_AS`, `Date_Paiement`) VALUES ( ?, ?, ?, ?) ',
                  [data.Matr, Eco, A_S, data.Date_Paiement], async function (error, results, fields) {
                        if (error) {
                              console.log(error);
                        } else {

                        }

                  });
            let results = await SelectMois(A_S, Eco);
            if (PayementText == '') {
                  PayementText += results.Label_Eco;
            } else PayementText += " + " + results.Label_Eco;
            EcoVal.push([Eco]);
            i++;
      }
      str += "INSERT INTO `journal_p`(`ID_Journal`, `Paiement`, `Date_P`, `Argent`, `add_by`, `Mode_P`, `Droit_Sco`, `ID_Ecolage`, `Id_AS`, `Matr`, `type`) VALUES ( " + (++IDJ) + ", '" + PayementText + "', '" + data.Date_Paiement + "'," + data.Argent + ", '" + user.username + "', 'Direct','false','" + [EcoVal] + "'," + (A_S) + "," + (data.Matr) + ", 'ECOLAGE');";
      con.query(str, async (err, rows) => {
            if (err) {
                  let user = req.session.user;
                  console.log(err);
                  let A_S = await GetAS();
                  return res.render('Paiment/CahierJr', { user, error: "Modification échoué", A_S });
            } else {
                  return res.redirect('/cahierJr');
            }
      });
}
exports.PayerFraisSco = async (req, res) => {
      const data = req.body;
      let user = await actualizeUser(req.session);
      let A_S = await GetActiveAS();
      let IDJ = await GetLastID("journal_p", "ID_Journal");
      let ScoVal = [];
      let str = '';
      let PayementText = '';
      let rls = await GetAutreFS(A_S);
      for (let i = 0; i < rls.length; i++) {
            // le variable s ici C'est le NAME sur l'INPUT CHECKBOX
            let s = rls[i].ID_autre + " " + rls[i].Label_Autre;
            let id = rls[i].ID_autre;
            if (data[s] == rls[i].ID_autre) {
                  let result = await PayerAutreFrais(data.Matr, id, A_S, data.Date_Paiement);
                  console.log(result);
                  let results = await SelectAutreFraisSco(A_S, id);
                  if (PayementText == '') {
                        PayementText += results.Label_Autre;
                  } else PayementText += " + " + results.Label_Autre;
                  ScoVal.push([id]);
            }
      }
      str += "INSERT INTO `journal_p`(`ID_Journal`, `Paiement`, `Date_P`, `Argent`, `add_by`, `Mode_P`, `Droit_Sco`, `ID_Autres`, `Id_AS`, `Matr`, `type`) VALUES ( " + (++IDJ) + ", '" + PayementText + "', '" + data.Date_Paiement + "'," + data.Argent + ", '" + user.username + "', 'Direct','false','" + [ScoVal] + "'," + (A_S) + "," + (data.Matr) + ", 'AutreFrais');";
      con.query(str, async (err, rows) => {
            if (err) {
                  let user = req.session.user;
                  console.log(err);
                  let A_S = await GetAS();
                  return res.render('Paiment/CahierJr', { user, error: "Modification échoué", A_S });
            } else {
                  return res.redirect('/cahierJr');
            }
      });
}
async function GetOBS() {
      let promise = new Promise((resolve, reject) => {
            con.query('SELECT * FROM `observation` ORDER BY ID_Obs; ',
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
var getmatr=async function GetMatrInfo(matr) {
      let A_S = await GetActiveAS();
      let promise = new Promise((resolve, reject) => {
            con.query('SELECT * FROM `etudiant` WHERE Matr=?; ',
                  [matr], function (error, results, fields) {
                        if (error) {
                              console.log(error);
                        }
                        if (results.length > 0) {
                              resolve(results);
                        } else resolve(null);
                  });
      });
      return await promise;
}
module.exports.GetMatrInfo=getmatr;

async function GetMatrInfoPaiementECO(matr) {
      console.log("MATR 0"+matr);
      let A_S = await GetActiveAS();
      let promise = new Promise((resolve, reject) => {
            con.query('SELECT etudiant.ID_Et,etudiant.Nom,etudiant.Prenom,etudiant.Adresse,etudiant.ImgPath,etudiant.ID_Obs,inscrire.ID_Niv FROM `etudiant`,`inscrire` WHERE (etudiant.Matr=inscrire.Matr) AND etudiant.Matr=? AND inscrire.Id_AS=?; ',
                  [matr, A_S], function (error, results, fields) {
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

async function GetMatrInfoPaiementFS(matr) {
      let A_S = await GetActiveAS();
      let promise = new Promise((resolve, reject) => {
            con.query('SELECT etudiant.ID_Et,etudiant.Nom,etudiant.Prenom,etudiant.Adresse,etudiant.ImgPath,etudiant.ID_Obs,inscrire.ID_Niv,payer_autre.ID_autre FROM `etudiant`,`inscrire`,`payer_autre` WHERE (etudiant.Matr=inscrire.Matr) AND (etudiant.Matr=payer_autre.Matr) AND etudiant.Matr=? AND inscrire.Id_AS=?; ',
                  [matr, A_S], function (error, results, fields) {
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
async function SelectMois(A_S, i) {
      let promise = new Promise((resolve, reject) => {
            con.query('SELECT * FROM `mois_ecolage` WHERE Id_AS = ? and ID_Eco = ?; ',
                  [A_S, i], function (error, results, fields) {
                        if (error) {
                              console.log(error)
                        }
                        if (results.length > 0) {
                              resolve(results[0]);
                        }
                  });
      });
      return await promise;
}
async function SelectAutreFraisSco(A_S, i) {
      let promise = new Promise((resolve, reject) => {
            con.query('SELECT * FROM `autres_fs` WHERE Id_AS = ? and ID_autre = ?; ',
                  [A_S, i], function (error, results, fields) {
                        if (error) {
                              console.log(error)
                        }
                        if (results.length > 0) {
                              resolve(results[0]);
                        }
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

async function GetPriceDroit(A_S, type, ID_Niv) {
      let str = "SELECT montant,Frais_Sco FROM `droit`,`niveau` WHERE droit.Id_AS=" + A_S + " and droit.ID_Niv=" + ID_Niv + " and type='" + type + "' and (droit.ID_Niv=niveau.ID_Niv) AND (droit.Id_AS=niveau.Id_AS);";
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
async function GetPrice(A_S, ID_Niv) {
      let str = "SELECT * FROM `niveau` WHERE Id_AS=" + A_S + " and ID_Niv=" + ID_Niv + ";";
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

async function InsertParent(matr, role, Nom_P, Prenom_P, email, Tel_1, Tel_2, Tel_3) {
      let ID = await GetLastID("parent", "ID_P");
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("Mot2passe", salt);
      let str = "INSERT INTO `parent`(`ID_P`, `Nom_P`, `Prenom_P`, `email`, `Tel_1`, `Tel_2`, `Tel_3`, `mdp`) VALUES ( " + (++ID) + ", '" + Nom_P + "','" + Prenom_P + "', '" + email + "', '" + Tel_1 + "', '" + Tel_2 + "', '" + Tel_3 + "','" + hashedPassword + "');";
      str += "INSERT INTO `parenté`(`Matr`, `ID_P`, `role`) VALUES ( " + matr + "," + ID + ", '" + role + "');";
      let promise = new Promise((resolve, reject) => {
            con.query(str,
                  function (error, results, fields) {
                        if (error) {
                              console.log(error);
                              resolve("ERROR");
                        }
                        if (results.length > 0) {
                              resolve("OK");
                        }
                  });
      });
      return await promise;
}
async function PayerAutreFrais(matr, ID_autre, A_S, Date) {
      let promise = new Promise((resolve, reject) => {
            con.query('INSERT INTO `payer_autre`(`Matr`, `Id_AS`, `ID_autre`, `Date_P`) VALUES ( ?, ?, ?, ?) ',
                  [matr, A_S, ID_autre, Date], async function (error, results, fields) {
                        if (error) {
                              console.log(error);
                              resolve("ERROR");
                        } else resolve("OK");

                  });
      });
      return await promise;
}
async function GetJournal(date, A_S) {
      let str = "SELECT DISTINCT ID_Journal, journal_p.Paiement, journal_p.Date_P, journal_p.Argent, journal_p.add_by, journal_p.Mode_P, journal_p.av_Droit, journal_p.Droit_Sco, journal_p.ID_Ecolage, etudiant.Matr, observation.Label_Obs, ImgPath, etudiant.Nom, etudiant.Prenom, journal_p.type FROM `journal_p`,`observation`,`etudiant` WHERE Date_P='" + date + "' and Id_AS=" + A_S + " and (observation.ID_Obs=etudiant.ID_Obs) and (journal_p.Matr=etudiant.Matr) ORDER BY ID_Journal DESC;";
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
async function GetAutreFS(A_S) {
      let str = "SELECT * FROM `autres_fs` WHERE Id_AS=" + A_S + "  ORDER BY ID_autre;";
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
async function GetLastIDwith_AS(table, champ, Matr) {
      let A_S = await GetActiveAS();
      let str = "SELECT MAX(" + champ + ") as lastID FROM " + table + " WHERE Id_AS = " + A_S + " and Matr=" + Matr + ";";
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