const express = require("express");
const app = express();
const port = 3000
const bodyParser = require('body-parser')
var session = require("express-session");

app.use(express.static('app/public'));

app.set('view engine', 'ejs');
app.set('views', './app/views');

app.use(bodyParser.urlencoded({ extended: true }));

// Configura a sessão
app.use(session({
    secret: 'starlight',
    resave: true,
    saveUninitialized: true
  }));
  
  

var rotas = require('./app/routes/router');
app.use("/", rotas);

app.listen(port, () =>{
    console.log(`Site Online`)
});


