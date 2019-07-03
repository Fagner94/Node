//Carregando módulos
const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require("body-parser");
const app = express();
const path = require("path");
const admin = require("./routers/admin");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash"); //tipo de sessão que só aparece uma ver
require("./models/Postagem")
require("./models/Categoria")
const Postagem = mongoose.model("postagens")
const Categoria = mongoose.model("categorias")
const usuarios = require("./routers/usuario");
//const outra = require("./routers/outra");


//configurações
//sessão
app.use(session({
    secret: "cursodenode",
    resave: true,
    saveUninitioalized: true
}))
app.use(flash());
//Middleware
app.use((req, res, next) => {
    // definição de variaveis globais
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    next();
});


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
    console.log("mondodb conectado");
}).catch((err) => {
    console.log("Houve um erro ao se concectar:  " + err);
})










//Public 

app.use(express.static(path.join(__dirname, "public")));
app.use((req, res, next) => {
    next();
});

//rotas
app.get('/', (req, res) => {
    Postagem.find().populate("categoria").sort({ data: "desc" }).then((postagens) => {
        res.render("index", { postagens: postagens });

    }).catch((err) => {
        req.flash("error_msg", "Houve um erro interno")
        res.redirect("/404")
    })

})

app.get("/categorias", (req, res) => {
    Categoria.find().then((categorias) => {

        res.render("categorias/index", { categorias: categorias })

    }).catch((err) => {
        req.flash("error_msg", "houve um erro interno")
        res.redirect("/")
    })
})
app.get("/categorias/:slug", (req, res) => {
    Categoria.findOne({ slug: req.params.slug }).then((categoria) => {
        if (categoria) {

            Postagem.find({ categoria: categoria._id }).then((postagens) => {

                res.render("categorias/postagem", { postagens: postagens })

            }).catch((err) => {
                req.flash("error_msg", "houve um erro ao listar os post")
                res.redirect("/")
            })

        } else {
            req.flash("error_msg", "esta categoria não existe")
            req.redirect("/")
        }

    }).catch((err) => {
        req.flash("error_msg", "houve um erro interno")
        res.redirect("/")
    })
})
// rota ler mais

app.get("/postagem/:slug", (req, res) => {
    Postagem.findOne({ slug: req.params.slug }).then((postagem) => {
        if (postagem) {
            res.render("postagem/index", { postagem: postagem })
        } else {
            req.flash("error_msg", "esta postagem não existe")
            res.redirect("/")
        }
    }).catch((err) => {
        req.flash("error_msg", "Hovue um erro interno")
        res.redirect("/")
    })
})
//
app.get("/404", (req, res) => {
    res.send('erro 404!')
})




app.use('/admin', admin);
app.use("/usuarios", usuarios);

//Outros

const PORT = 8081;
app.listen(PORT, () => {
    console.log("servidor rodando");
});