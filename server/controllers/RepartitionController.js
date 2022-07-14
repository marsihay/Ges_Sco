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
            let ID_Niv = 0;
            return res.render('Paiment/Repartition', { user, A_S });
      }
}
exports.GetClassList = async (req, res) => {
      let list = await GetClasse();
      return res.send(list);
}
exports.GetLastNumClass = async (req, res) => {
      const { ID_C } = req.body;
      let num = await GetLastIDwith_AS('appartenir', 'Num', ID_C);
      return res.send("" + num);
}
exports.CheckNumClass = async (req, res) => {
      const { Num,Matr,ID_C } = req.body;
      let result = await CheckThisNum(Num,Matr,ID_C);
      return res.send("" + result);
}
exports.SaveNumClass = async (req, res) => {
      const { Num,Matr,ID_C } = req.body;
      let A_S = await GetActiveAS();
      con.query('INSERT INTO `appartenir`(`Matr`, `Id_AS`, `ID_C`, `Num`) VALUES ( ?, ?, ?, ?)',
            [Matr, A_S,ID_C, Num], async (err, rows) => {
                  if (err) {
                        console.log(err);
                       return res.status(400).send(error);
                  } else {
                       return res.status(200).send(rows);
                  }
            });
      
}
exports.viewLIST = async (req, res) => {
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
            let ID_Niv = 0;
            return res.render('Paiment/ListeParClasse', { user, A_S });
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
async function GetLastIDwith_AS(table, champ, ID_C) {
      let A_S = await GetActiveAS();
      let str = "SELECT MAX(" + champ + ") as lastID FROM " + table + " WHERE Id_AS = " + A_S + " AND ID_C=" + ID_C + ";";
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
async function CheckThisNum(Num,Matr,ID_C) {
      let res="";
      let A_S = await GetActiveAS();
      let str0 = "SELECT * FROM `appartenir` WHERE Matr=" + Matr + " and Id_AS=" + A_S + " ;";
      let str = "SELECT * FROM `appartenir` WHERE Num=" + Num + " and Id_AS=" + A_S + " and Id_C=" + ID_C + ";";
      let str1 = "SELECT * FROM `inscrire` WHERE Matr=" + Matr + " and Id_AS=" + A_S + ";";
      let nb=0;
      let promise = new Promise((resolve, reject) => {
            con.query(str, function (error, results, fields) {
                        if (error) {
                              console.log(error)
                        }
                        if (results.length > 0) {
                              //Raha ohatra ka misy valiny dia efa ao zan ilay Num
                              nb--;
                        } else nb++;
                  });
                  con.query(str0, function (error, results, fields) {
                        if (error) {
                              console.log(error)
                        }
                        if (results.length > 0) {
                              //Raha ohatra ka misy valiny dia efa ao zan ilay Matr
                              nb--;
                        } else nb++;
                        if(nb == 2){
                              res += Num+"true ";
                        }else res += Num+"false ";
                  });
                  con.query(str1, function (error, results, fields) {
                              if (error) {
                                    console.log(error)
                              }
                              if (results.length > 0) {
                                    //Raha ohatra ka efa nanao Inscription ilay Matricule
                                    res += Matr+"true";
                              } else res += Matr+"false";
                              resolve(res);
                        });
      });
      return await promise;
}