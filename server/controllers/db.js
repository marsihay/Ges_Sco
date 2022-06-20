const mysql= require('mysql');
let connection= mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database: 'et_db',
    multipleStatements: true
})
connection.connect((error =>{
    if(error){console.log(error)}
    else console.log("MySQL Connected . . .")
}));
 
module.exports = connection;