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
            let ecolage=await GetMoisEcolage();
            let niveau=await GetNiveau();
            return res.render('Setting/setting', { user, droit,ecolage,niveau });
      }
}

exports.edit = (req, res) => {
      if (!req.session.loggedin && !req.session.lockScreen) {
            return res.redirect('/auth/login');
      } if (req.session.loggedin && req.session.lockScreen) {
            return res.redirect('/auth/lock_screen');
      } else {
            // User the connection
            con.query('SELECT * FROM droit WHERE ID_Droit = ?', [req.params.ID], async (err, rowsRes) => {
                  if (err) {
                        return console.log(err);
                  } else {
                        req.session.lockScreen = false;
                        req.session.loggedin = true;
                        req.session.current_url = req.url;
                        let user = await actualizeUser(req.session);
                        const { ...rows } = await rowsRes[0];
                        return res.render('Setting/droit/edit_droit', { user, rows });
                  }
            });
      }
}

exports.update = (req, res) => {
      const { ID_Droit, Label_D, montant } = req.body;
      // User the connection
      con.query('UPDATE droit SET Label_D = ?, montant = ? WHERE ID_Droit = ?',
            [Label_D, montant, req.params.ID], async (err, rows) => {
                  if (err) {
                        let user = req.session.user;
                        let rows = { ID_Droit: ID_Droit, Label_D: Label_D, montant: montant };
                        console.log(err);
                        return res.render('Setting/droit/edit_droit', { user, rows, error: "Modification échoué", Droit: "2" });
                  } else {
                        return res.redirect('/setting');
                  }
            });
}
exports.updateMois = (req, res) => {
      const { ID_Eco, Label_Eco } = req.body;
      // User the connection
      con.query('UPDATE mois_ecolage SET Label_Eco = ? WHERE ID_Eco = ?',
            [Label_Eco, ID_Eco], async (err, rows) => {
                  if (err) {
                        let user = req.session.user;
                        return res.render('Setting/setting', { user, error: "Modification échoué" });
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
      let promise = new Promise((resolve, reject) => {
            con.query('SELECT * FROM `droit`; ',
                  function (error, results, fields) {
                        if (error) {
                              console.log(error)
                        }
                        if (results.length > 0) {
                              resolve(results);
                        }
                  });
      });
      return await promise;
}
async function GetMoisEcolage() {
      let promise = new Promise((resolve, reject) => {
            con.query('SELECT * FROM `mois_ecolage`; ',
                  function (error, results, fields) {
                        if (error) {
                              console.log(error)
                        }
                        if (results.length > 0) {
                              resolve(results);
                        }
                  });
      });
      return await promise;
}
async function GetNiveau() {
      let promise = new Promise((resolve, reject) => {
            con.query('SELECT * FROM `niveau`; ',
                  function (error, results, fields) {
                        if (error) {
                              console.log(error)
                        }
                        if (results.length > 0) {
                              resolve(results);
                        }
                  });
      });
      return await promise;
}

