//Carregando módulos

const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require("body-parser");
const app = express();

const outra = require("./routers/outra");
const admin = require("./routers/admin");
//const mongoose = require("mongoose");
//configurações
//body parser
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
//Handlebars
app.engine('handlebars', handlebars({
    defaultLayout: 'main'
}));
app.set('view engine', handlebars);



//rotas
app.use('/outra', outra);
app.use('/admin', admin);


//Outros

const PORT = 8081;
app.listen(PORT, () => {
    console.log("servidor rodando");
});