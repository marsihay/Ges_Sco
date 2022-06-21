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
            let A_S = await GetAS();
            return res.render('Paiment/CahierJr', { user, A_S });
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