//Carregando módulos
const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require("body-parser");
const app = express();
const path = require("path");
const admin = require("./routers/admin");
const mongoose = require("mongoose");
//const outra = require("./routers/outra");


//configurações
//Handlebars template engine
app.engine('handlebars', handlebars({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//body parser
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


//mongoose
mongoose.connect("mongodb://banco:banco123@ds149806.mlab.com:49806/nbanco"

).then(() => {
    console.log("mondodb conectado")
}).catch((err) => {
    console.log("Houve um erro ao se concectar:  " + err)
})










//Public 

app.use(express.static(path.join(__dirname, "public")));


//rotas
app.get('/', (req, res) => {
    res.send('rota principal');
})


app.use('/admin', admin);


//Outros

const PORT = 8081;
app.listen(PORT, () => {
    console.log("servidor rodando");
});