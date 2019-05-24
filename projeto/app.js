//Carregando módulos
const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require("body-parser");
const app = express();
const path = require("path");
const admin = require("./routers/admin");
const outra = require("./routers/outra");

//const mongoose = require("mongoose");
//configurações




//body parser
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());




//Handlebars template engine
app.engine('handlebars', handlebars({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//Public 

app.use(express.static(path.join(__dirname, "public")));


//rotas

app.use('/admin', admin);


//Outros

const PORT = 8081;
app.listen(PORT, () => {
    console.log("servidor rodando");
});