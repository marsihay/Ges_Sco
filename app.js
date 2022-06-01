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

app.use(function(req, res, next) {
    res.status(404);
  
    // respond with html page
    if (req.accepts('html')) {
      res.render('partials/404');
      return;
    }
  });

Handlebars.registerHelper('copyrightYear', function() {
  var year = new Date().getFullYear();
  return new Handlebars.SafeString(year);
});


  
app.listen(port, () => console.log(`Listening on port ${port}`));