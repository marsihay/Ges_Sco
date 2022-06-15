const express = require('express');
const exphbs = require('express-handlebars');
var Handlebars = require('handlebars');
const session = require('express-session');
const path = require('path');
//const bodyParser = require('body-parser'); // No longer Required
//const mysql = require('mysql'); // Not required -> moved to userController

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//use express session
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true,
  cookie:{
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  }
}));

// Parsing middleware
// Parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: true })); // New

// Parse application/json
// app.use(bodyParser.json());
app.use(express.json()); // New

// Static Files
app.use(express.static('public'));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Templating Engine
const handlebars = exphbs.create({ extname: '.hbs', });
app.engine('.hbs', handlebars.engine);
app.set('view engine', '.hbs');

// You don't need the connection here as we have it in userController
// let connection = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASS,
//   database: process.env.DB_NAME
// });

const auth = require('./server/routes/auth');
const routes = require('./server/routes/home');
app.use('/', routes);
app.use('/auth', auth);

const Home = require('./server/controllers/HomeController');
app.use(function(req, res, next) {
    res.status(404);
  
    // respond with html page
    if (req.accepts('html')) {   
      let session=req.session;      
      return res.render('partials/404', {session});
    }
  });

Handlebars.registerHelper('copyrightYear', function() {
  const options = { month: 'long'};
  var date=new Date();
  var month= new Intl.DateTimeFormat('fr-FR', options).format(date);
  var year = date.getFullYear();
  return new Handlebars.SafeString(month+" "+year);
});

Handlebars.registerHelper('AppName', function() {
  return new Handlebars.SafeString("Gessco");
});

Handlebars.registerHelper("Decimal", function (Nb) {
  //return Nb1.toLocaleString('en-US', { style: 'currency', currency: 'MGA' });
  return separateComma(parseFloat(Nb).toFixed(2));
})
function separateComma(val) {
  // remove sign if negative
  var sign = 1;
  if (val < 0) {
    sign = -1;
    val = -val;
  }
  // trim the number decimal point if it exists
  let num = val.toString().includes('.') ? val.toString().split('.')[0] : val.toString();
  let len = num.toString().length;
  let result = '';
  let count = 1;

  for (let i = len - 1; i >= 0; i--) {
    result = num.toString()[i] + result;
    if (count % 3 === 0 && count !== 0 && i !== 0) {
      // eto no Reglena hoe virgule ve ny séparateur sa espace
      result = ' ' + result;
    }
    count++;
  }

  // add number after decimal point
  if (val.toString().includes('.')) {
    result = result + '.' + val.toString().split('.')[1];
  }
  // return result with - sign if negative
  return sign < 0 ? '-' + result : result;
}
app.listen(port, () => console.log(`Listening on port ${port}`));