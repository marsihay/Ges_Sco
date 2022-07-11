const { bool } = require('joi');
const con = require('./db');
// Setting view 
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
            let droit = await GetDroitInscription();
            let ecolage = await GetMoisEcolage();
            let niveau = await GetNiveau();
            let classe = await GetClasse();
            let Frais_Sco = await GetFrais_Sco();
            let A_S = await GetAS();
            return res.render('Setting/setting', { user, droit, ecolage, niveau, classe, Frais_Sco, A_S });
      }
}

exports.AddDroit = async (req, res) => {
      const data = req.body;
      let A_S = await GetActiveAS();
      let id = await GetLastID("droit", "id");
      let ID_Droit = await GetLastIDwith_AS("droit", "ID_Droit");
      let str = "INSERT INTO `droit`(`id`, `ID_Droit`, `type`, `Label_D`, `montant`, `Id_AS`, `ID_Niv`) VALUES ( "+(++id)+", "+(++ID_Droit)+", 'false', '"+data.Label_NivD+" VAOVAO', "+data.montant0+", "+A_S+", "+data.ID_Niv+");";
      str += "INSERT INTO `droit`(`id`, `ID_Droit`, `type`, `Label_D`, `montant`, `Id_AS`, `ID_Niv`) VALUES ( "+(++id)+", "+(++ID_Droit)+", 'true', '"+data.Label_NivD+" TRANAINY', "+data.montant+", "+A_S+", "+data.ID_Niv+");";
      con.query(str, async (err, rows) => {
                  if (err) {
                        let user = req.session.user;
                        console.log(err);
                        let A_S = await GetAS();
                        return res.render('Setting/setting', { user, error: "Modification échoué", A_S });
                  } else {
                        return res.redirect('/setting');
                  }
            });
}

exports.edit =async (req, res) => {
      if (!req.session.loggedin && !req.session.lockScreen) {
            return res.redirect('/auth/login');
      } if (req.session.loggedin && req.session.lockScreen) {
            return res.redirect('/auth/lock_screen');
      } else {
            // User the connection
            let A_S = await GetActiveAS();
            con.query('SELECT * FROM droit WHERE ID_Droit = ? AND Id_AS = ?', [req.params.ID,A_S], async (err, rowsRes) => {
                  if (err) {
                        return console.log(err);
                  } else {
                        req.session.lockScreen = false;
                        req.session.loggedin = true;
                        req.session.current_url = req.url;
                        let user = await actualizeUser(req.session);
                        const { ...rows } = await rowsRes[0];
                        let A_S = await GetAS();
                        return res.render('Setting/droit/edit_droit', { user, rows, A_S });
                  }
            });
      }
}

exports.update =async (req, res) => {
      const { ID_Droit, Label_D, montant } = req.body;
      let A_S = await GetActiveAS();
      // User the connection
      con.query('UPDATE droit SET Label_D = ?, montant = ? WHERE ID_Droit = ? AND Id_AS = ?',
            [Label_D, montant, req.params.ID,A_S], async (err, rows) => {
                  if (err) {
                        let user = req.session.user;
                        let rows = { ID_Droit: ID_Droit, Label_D: Label_D, montant: montant };
                        console.log(err);
                        let A_S = await GetAS();
                        return res.render('Setting/droit/edit_droit', { user, rows, error: "Modification échoué", Droit: "2", A_S });
                  } else {
                        return res.redirect('/setting');
                  }
            });
}

exports.GetIDMois = async (req, res) => {
      let ID_Eco = await GetLastIDwith_AS("mois_ecolage", "ID_Eco");
      let Nb_moisMAX= await GetNB_MoisMAX();
      let bool=false;
      if (++ID_Eco <= Nb_moisMAX) {
            bool=true;
      }
      return res.send(bool);
}

exports.addMois =async (req, res) => {
      const { Label_Eco } = req.body;
      let A_S = await GetActiveAS();
      let id = await GetLastID("mois_ecolage", "id");
      let ID_Eco = await GetLastIDwith_AS("mois_ecolage", "ID_Eco");
      // User the connection
      con.query('INSERT INTO `mois_ecolage`(`id`, `ID_Eco`, `Label_Eco`, `Id_AS`) VALUES ( ?, ?, ?, ?)',
            [++id, ++ID_Eco,Label_Eco, A_S], async (err, rows) => {
                  if (err) {
                        let user = req.session.user;
                        let A_S = await GetAS();
                        return res.render('Setting/setting', { user, error: "Modification échoué", A_S });
                  } else {
                        return res.redirect('/setting');
                  }
            });
}

exports.updateMois =async (req, res) => {
      const { ID_Eco, Label_Eco } = req.body;
      let A_S = await GetActiveAS();
      // User the connection
      con.query('UPDATE mois_ecolage SET Label_Eco = ? WHERE ID_Eco = ? AND Id_AS = ?',
            [Label_Eco, ID_Eco, A_S], async (err, rows) => {
                  if (err) {
                        let user = req.session.user;
                        let A_S = await GetAS();
                        return res.render('Setting/setting', { user, error: "Modification échoué", A_S });
                  } else {
                        return res.redirect('/setting');
                  }
            });
}

exports.updateNIV = async (req, res) => {
      let A_S = await GetActiveAS();
      const { ID_Niv, Label_Niv, Frais_Sco, Nb_mois } = req.body;
      // User the connection
      con.query('UPDATE niveau SET Label_Niv = ?,Frais_Sco=?,Nb_mois=? WHERE ID_Niv = ? and Id_AS=?',
            [Label_Niv, Frais_Sco, Nb_mois, ID_Niv, A_S], async (err, rows) => {
                  if (err) {
                        let user = req.session.user;
                        let A_S = await GetAS();
                        return res.render('Setting/setting', { user, error: "Modification échoué", A_S });
                  } else {
                        return res.redirect('/setting');
                  }
            });
}

exports.addNIV = async (req, res) => {
      let A_S = await GetActiveAS();
      let ID = await GetLastID("niveau", "id");
      let ID_Niv = await GetLastIDwith_AS("niveau", "ID_Niv");
      const { Label_Niv, Frais_Sco, Nb_mois } = req.body;
      // User the connection
      con.query('INSERT INTO `niveau`(`id`, `ID_Niv`, `Label_Niv`, `Frais_Sco`, `Nb_mois`, `Id_AS`) VALUES ( ?, ?, ?, ?, ?, ?)',
            [++ID, ++ID_Niv, Label_Niv, Frais_Sco, Nb_mois, A_S], async (err, rows) => {
                  if (err) {
                        let user = req.session.user;
                        console.log(err);
                        let A_S = await GetAS();
                        return res.render('Setting/setting', { user, error: "Modification échoué", A_S });
                  } else {
                        return res.redirect('/setting');
                  }
            });
}

exports.delNIV = async (req, res) => {
      let A_S = await GetActiveAS();
      const { ID_Niv } = req.body;
      let str="DELETE FROM `droit` WHERE ID_Niv = "+ID_Niv+" and Id_AS = "+A_S+";";
      str += "DELETE FROM `niveau` WHERE ID_Niv = "+ID_Niv+" and Id_AS = "+A_S+";"
      // User the connection
      con.query(str, async (err, rows) => {
                  if (err) {
                        let user = req.session.user;
                        console.log(err);
                        let A_S = await GetAS();
                        return res.render('Setting/setting', { user, error: "Suppression échoué", A_S });
                  } else {
                        return res.redirect('/setting');
                  }
            });
}

exports.GetNiveau = async (req, res) => {
      let niveau = await GetNiveau();
      return res.send(niveau);
}
exports.GetNiveauDroit = async (req, res) => {
      let niveau = await GetNiveauDroit();
      return res.send(niveau);
}

exports.AddAS = async (req, res) => {
      let Id_AS = await GetLastID("a_s", "Id_AS");
      const { Label_AS } = req.body;
      con.query('INSERT INTO `a_s`(`Id_AS`, `Label_AS`) VALUES ( ?, ?)',
            [++Id_AS, Label_AS], async (err, rows) => {
                  if (err) {
                        let user = req.session.user;
                        console.log(err);
                        let A_S = await GetAS();
                        return res.render('Setting/setting', { user, error: "Modification échoué", A_S });
                  } else {
                        return res.redirect('/setting');
                  }
            });
}

exports.updateAS = (req, res) => {
      const { Id_AS, Label_AS } = req.body;
      // User the connection
      con.query('UPDATE a_s SET Label_AS=? WHERE Id_AS = ?',
            [Label_AS, Id_AS], async (err, rows) => {
                  if (err) {
                        let user = req.session.user;
                        let A_S = await GetAS();
                        return res.render('Setting/setting', { user, A_S, error: "Modification échoué" });
                  } else {
                        return res.redirect('/setting');
                  }
            });
}

exports.delAS = async (req, res) => {
      const { Id_AS } = req.body;
      // User the connection
      con.query('DELETE FROM `a_s` WHERE Id_AS=?',
            [Id_AS], async (err, rows) => {
                  if (err) {
                        let user = req.session.user;
                        console.log(err);
                        let A_S = await GetAS();
                        return res.render('Setting/setting', { user, A_S, error: "Suppression échoué" });
                  } else {
                        return res.redirect('/setting');
                  }
            });
}

exports.AddClasse = async (req, res) => {
      let ID_C = await GetLastID("classe", "ID_C");
      const { ID_Niv, Label_C } = req.body;
      console.log(ID_C);
      con.query('INSERT INTO `classe`(`ID_C`, `Label_C`, `ID_Niv`) VALUES ( ?, ?, ?)',
            [++ID_C, Label_C, ID_Niv], async (err, rows) => {
                  if (err) {
                        let user = req.session.user;
                        console.log(err);
                        let A_S = await GetAS();
                        return res.render('Setting/setting', { user, A_S, error: "Modification échoué" });
                  } else {
                        return res.redirect('/setting');
                  }
            });
}

exports.updateClasse = (req, res) => {
      const { ID_C, Label_C, ID_Niv } = req.body;
      // User the connection
      con.query('UPDATE classe SET Label_C = ?,ID_Niv=? WHERE ID_C = ?',
            [Label_C, ID_Niv, ID_C], async (err, rows) => {
                  if (err) {
                        let user = req.session.user;
                        let A_S = await GetAS();
                        return res.render('Setting/setting', { user, A_S, error: "Modification échoué" });
                  } else {
                        return res.redirect('/setting');
                  }
            });
}

exports.delClasse = async (req, res) => {
      const { ID_C } = req.body;
      // User the connection
      con.query('DELETE FROM `classe` WHERE ID_C=?',
            [ID_C], async (err, rows) => {
                  if (err) {
                        let user = req.session.user;
                        console.log(err);
                        let A_S = await GetAS();
                        return res.render('Setting/setting', { user, A_S, error: "Suppression échoué" });
                  } else {
                        return res.redirect('/setting');
                  }
            });
}

exports.AddFrais = async (req, res) => {
      let A_S = await GetActiveAS();
      let ID = await GetLastID("autres_fs", "id");
      let ID_autre = await GetLastIDwith_AS("autres_fs", "ID_autre");
      const { Label_Autre, cout } = req.body;
      con.query('INSERT INTO `autres_fs`(`id`,`ID_autre`, `Label_Autre`, `cout`, `Id_AS`) VALUES ( ?, ?, ?, ?, ?)',
            [++ID, ++ID_autre, Label_Autre, cout, A_S], async (err, rows) => {
                  if (err) {
                        let user = req.session.user;
                        console.log(err);
                        let A_S = await GetAS();
                        return res.render('Setting/setting', { user, A_S, error: "Modification échoué" });
                  } else {
                        return res.redirect('/setting');
                  }
            });
}

exports.updateFrais = async (req, res) => {
      let A_S = await GetActiveAS();
      const { ID_autre, Label_Autre, cout } = req.body;
      // User the connection
      con.query('UPDATE autres_fs SET Label_Autre = ?,cout=? WHERE ID_autre = ? and Id_AS = ?',
            [Label_Autre, cout, ID_autre, A_S], async (err, rows) => {
                  if (err) {
                        let user = req.session.user;
                        let A_S = await GetAS();
                        return res.render('Setting/setting', { user, A_S, error: "Modification échoué" });
                  } else {
                        return res.redirect('/setting');
                  }
            });
}

exports.delFrais = async (req, res) => {
      const { ID_autre } = req.body;
      let A_S = await GetActiveAS();
      con.query('DELETE FROM `autres_fs` WHERE ID_autre = ? and Id_AS = ?',
            [ID_autre, A_S], async (err, rows) => {
                  if (err) {
                        let user = req.session.user;
                        console.log(err);
                        let A_S = await GetAS();
                        return res.render('Setting/setting', { user, A_S, error: "Suppression échoué" });
                  } else {
                        return res.redirect('/setting');
                  }
            });
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
async function GetDroitInscription() {
      let A_S = await GetActiveAS();
      let promise = new Promise((resolve, reject) => {
            con.query('SELECT * FROM `droit` WHERE Id_AS = ? ORDER BY ID_Droit; ',
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
async function GetMoisEcolage() {
      let A_S = await GetActiveAS();
      let promise = new Promise((resolve, reject) => {
            con.query('SELECT * FROM `mois_ecolage` WHERE Id_AS = ? ORDER BY ID_Eco; ',
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
async function GetNiveau() {
      let A_S = await GetActiveAS();
      let promise = new Promise((resolve, reject) => {
            con.query('SELECT * FROM `niveau` WHERE Id_AS = ? ORDER BY ID_Niv; ',
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
async function GetNiveauDroit() {
      let A_S = await GetActiveAS();
      let promise = new Promise((resolve, reject) => {
            con.query('SELECT * FROM niveau WHERE ID_Niv NOT IN (SELECT DISTINCT ID_Niv FROM droit WHERE Id_AS=?) and Id_AS=? LIMIT 1;',
                  [A_S, A_S], function (error, results, fields) {
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
async function GetClasse() {
      let promise = new Promise((resolve, reject) => {
            con.query('SELECT * FROM `classe` ORDER BY ID_C; ',
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
async function GetFrais_Sco() {
      let A_S = await GetActiveAS();
      let promise = new Promise((resolve, reject) => {
            con.query('SELECT * FROM `autres_fs` WHERE Id_AS = ? ORDER BY ID_autre; ',
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
async function GetLastIDwith_AS(table, champ) {
      let A_S = await GetActiveAS();
      let str = "SELECT MAX(" + champ + ") as lastID FROM " + table + " WHERE Id_AS = " + A_S + ";";
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

async function GetNB_MoisMAX() {
      let A_S = await GetActiveAS();
      let str = "SELECT MAX(Nb_mois) as Nb_moisMAX FROM niveau WHERE Id_AS = " + A_S + ";";
      let promise = new Promise((resolve, reject) => {
            con.query(str,
                  function (error, results, fields) {
                        if (error) {
                              console.log(error)
                        }
                        if (results.length > 0) {
                              if (results[0].Nb_moisMAX != null) {
                                    resolve(results[0].Nb_moisMAX);
                              } else resolve(0);
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
async function SetActiveAS(Id_AS) {
      let str = "UPDATE active SET A_S = ? ;";
      let promise = new Promise((resolve, reject) => {
            con.query(str,[Id_AS],
                  function (error, results, fields) {
                        if (error) {
                              console.log(error);
                        } else resolve(Id_AS);
                  });
      });
      return await promise;
}

// Change The Current Année Scolaire
exports.GetAS  = async (req, res) => {
      return res.send(''+ await GetActiveAS());
}
exports.SetAS  = async (req, res) => {
      const { Id_AS } = req.body;
      return res.send(''+ await SetActiveAS(Id_AS));
}
