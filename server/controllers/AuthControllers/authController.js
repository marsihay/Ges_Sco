const con = require('../db');
const bcrypt = require('bcryptjs');
//const localStorage = require("localStorage");
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

exports.login = async (req, res) => {
  if (req.session.loggedin && !req.session.lockScreen) {
    return res.redirect('/home');
  } else
    if (req.session.loggedin && req.session.lockScreen) {
      return res.redirect('/auth/lock_screen');
    } else {
      req.session.lockScreen = false;
      req.session.loggedin = false;
      let A_S = await GetAS();
      return res.render('Auth/login', { A_S, data: { email: "" } });
    }
}

exports.loginSubmit = async (req, res) => {
  const data = req.body;
  if (data.email && data.password) {
    con.query('SELECT * FROM login WHERE email = ? ', [data.email],
      async function (error, results, fields) {
        if (error) {
          let A_S = await GetAS();
          return res.render('Auth/login', { error: error, data, A_S });
        }
        if (results.length > 0) {
          if (!await bcrypt.compare(data.password, results[0].password)) {
            let A_S = await GetAS();
            return res.render('Auth/login', { error: 'Mot de passe incorrect', data, A_S });
          }
          req.session.loggedin = true;
          req.session.lockScreen = false;
          const { password, ...user } = await results[0];
          req.session.user = user;
          return res.redirect('/home');
        } else {
          let A_S = await GetAS();
          return res.render('Auth/login', { error: 'Incorrect Email', data, A_S });
        }
      });
  } else {
    let A_S = await GetAS();
    return res.render('Auth/login', { A_S, error: 'Completez le champ email et password' });
  }
}

exports.register = async (req, res) => {
  if (req.session.loggedin && !req.session.lockScreen) {
    return res.redirect('/home');
  } else
    if (req.session.loggedin && req.session.lockScreen) {
      return res.redirect('/auth/lock_screen');
    } else {
      req.session.lockScreen = false;
      req.session.loggedin = false;
      let A_S = await GetAS();
      return res.render('Auth/register', { A_S, data: { email: "", username: "" } });
    }
}

exports.registerSubmit = async (req, res) => {
  const data = req.body;
  if (data.password == data.password1) {
    const salt = await bcrypt.genSalt(10);
    //console.log(req.body.email+' '+req.body.password);
    const hashedPassword = await bcrypt.hash(data.password, salt);
    con.query("INSERT INTO login(username, email, password) values ( ?, ?, ?)",
      [data.username, data.email, hashedPassword], async (error, list) => {
        if (error) {
          let A_S = await GetAS();
          return res.render('Auth/register', { A_S, error: error, data });
        } else {
          con.query('SELECT * FROM login WHERE email = ? ', [data.email],
            async function (error, results, fields) {
              if (error) { res.status(400).send(error); }
              if (results.length > 0) {
                req.session.loggedin = true;
                req.session.lockScreen = false;
                const { password, ...user } = await results[0];
                req.session.user = user;
                return res.redirect('/home');
              } else {
                let A_S = await GetAS();
                return res.render('Auth/register', { A_S, error: 'Incorrect Email', data });
              }
            });
        }
      })
  } else {
    let A_S = await GetAS();
    return res.render('Auth/register', { A_S, error: 'Mot de passe non identique', data });
  }
}

exports.logout = async (req, res) => {
  req.session.destroy();
  let A_S = await GetAS();
  return res.render('Auth/logout', A_S);
}

exports.lockScreen = async (req, res) => {
  if (req.session.loggedin && !req.session.lockScreen) {
    req.session.lockScreen = true;
    req.session.loggedin = true;
    let A_S = await GetAS();
    return res.render('Auth/lock_screen', { A_S, userLocked: req.session.user });
  } else
    if (!req.session.loggedin && !req.session.lockScreen) {
      return res.redirect('/auth/login');
    } else if (req.session.loggedin && req.session.lockScreen) {
      let A_S = await GetAS();
      return res.render('Auth/lock_screen', { A_S, userLocked: req.session.user });
    } else {
      return res.redirect('/');
    }
}

exports.lockScreenSub = async (req, res) => {
  const data = req.body;
  if (data.email && data.password) {
    con.query('SELECT * FROM login WHERE email = ? ', [data.email],
      async function (error, results, fields) {
        if (error) {
          let userLocked = req.session.user;
          let A_S = await GetAS();
          return res.render('Auth/lock_screen', { A_S, userLocked, error: error });
        }
        if (results.length > 0) {
          if (!await bcrypt.compare(data.password, results[0].password)) {
            let userLocked = req.session.user;
            let A_S = await GetAS();
            return res.render('Auth/lock_screen', { A_S, userLocked, error: 'Mot de passe incorrect' });
          }
          req.session.lockScreen = false;
          req.session.loggedin = true;
          const { password, ...user } = await results[0];
          req.session.user = user;
          return res.redirect(req.session.current_url);
        } else {
          let A_S = await GetAS();
          return res.render('Auth/lock_screen', { A_S, error: 'Incorrect Email', userLocked: req.session.user });
        }
      });
  } else {
    let A_S = await GetAS();
    return res.render('Auth/lock_screen', { A_S, error: 'Completez le champ password', userLocked: req.session.user });
  }
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
