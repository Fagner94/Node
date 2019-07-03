const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("../models/Categoria");
const Categoria = mongoose.model("categorias");

require('../models/Postagem');
const Postagem = mongoose.model("postagens");

//rotas


//rota página inicial
router.get('/', (req, res) => {
    res.render("admin/index");
});


router.get('/categorias/add', (req, res) => {
    res.render('admin/addcategorias');
});

//rota categorias lista as categorias
router.get('/categorias', (req, res) => {
    //lista todos os documentos que existe
    Categoria.find().sort({
        date: 'desc'
    }).then((categorias) => {
        res.render("admin/categorias", {
            categorias: categorias
        });
    }).catch((err) => {
        req.flash("erro_msg", "houve um erro ao listar categorias");
        res.redirect("/admin");
    })



});

// rota página edição de categoria

router.get("/categorias/edit/:id", (req, res) => {
    Categoria.findOne({ _id: req.params.id }).then((categoria) => {
        res.render("admin/editcategoria", { categoria: categoria });
    }).catch((err) => {
        req.flash("error_msg", "Esta categoria não existe");
        res.redirect("/admin/categorias");
    });
});
//edição de categoria 
router.post("/categorias/edit", (req, res) => {
    Categoria.findOne({ _id: req.body.id }).then((categoria) => {
        categoria.nome = req.body.nome
        categoria.slug = req.body.slug

        categoria.save().then(() => {
            req.flash("success_msg", "categoria editada com sucesso !")
            res.redirect("/admin/categorias")
        }).catch((erro) => {
            req.flash("error_msg", "Houve um erro interno ao salvar a categoria")
            res.redirect("/admin/categorias");
        })

    }).catch((err) => {
        req.flash("error_msg", "houve um erro ao editar a categoria")
        res.redirect("/admin/categorias")
    })

});



//deletando categoria com rota get


router.post("/categorias/deletar", (req, res) => {
    //recebe qual categoria deve receber
    //vai apagar uma categoria com id igual que vem do formulário
    Categoria.remove({ _id: req.body.id }).then(() => {
        req.flash("success_msg", "Categoria removida com suceso");
        res.redirect("/admin/categorias")
    }).catch((err) => {
        req.flash("error_msg", "erro ao remove categoria");
        res.redirect("/admin/categorias")
    })
})



//////////////////////////////////////////////////postagens//////////////////////////////////

////////// editar postagens ///////////

router.get("/postagens/edit/:id", (req, res) => {
    /*ache uma postagem com um id que será passado 
    pelo params
    */
    Postagem.findOne({ _id: req.params.id }).then((postagem) => {

        //segunda pesquisa
        Categoria.find().then((categorias) => {
            res.render("admin/editpostagens", { categorias: categorias, postagem: postagem })
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao listar as categorias")
            res.redirect("/admin/postagens")
        })


    }).catch((err) => {
        req.flash("error_msg", "houve um erro ao carregar o formulario de edição")
        res.redirect("/admin/postagens");
    })

})
router.post("/postagem/edit", (req, res) => {

    Postagem.findOne({ _id: req.body.id }).then((postagem) => {
        postagem.titulo = req.body.titulo
        postagem.slug = req.body.slug
        postagem.descricao = req.body.descricao
        postagem.conteudo = req.body.conteudo
        postagem.categoria = req.body.categoria

        postagem.save().then(() => {
            req.flash("success_msg", "Postagem editada com sucesso")
            res.redirect("/admin/postagens")

        }).catch((err) => {
            req.flash("error_msg", "Erro interno")
            res.redirect("/admin/postagem")
        })

    }).catch((err) => {
        req.flash("error_msg", "Erro ao salvar a edição")
        res.redirect("/admin/postagens")
    })

})


//// listando postagens///////
router.get('/postagens', (req, res) => {
    Postagem.find().populate("categoria").sort({ data: "desc" }).then((postagens) => {
        res.render("admin/postagens", { postagens: postagens })
    }).catch((err) => {
        res.flash("error_msg", "erro ao listar postagens")
        res.render("/admin")
    })
})




router.get('/postagens/add', (req, res) => {
    Categoria.find().then((categorias) => {
        res.render('admin/addpostagens', { categorias: categorias }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao carregar as postagens")
        })
    })
})








///////////////criar postagem/////////////////////
//////// rota adicionar postagen/////////

router.post('/postagens/nova', (req, res) => {
    // validar o campo categoria

    var erros = [];
    // caso não tenha categoria cadastrada
    if (req.body.categoria == "0") {
        //sera adicionado um erro no vetor, com uma mensagem
        erros.push({ texto: "Categoria invalida, registre uma categoria" })

    }
    //caso exita um erro( o vetor só sera maior que zero ser for adicionado algo)
    if (erros.length > 0) {
        res.render('admin/addpostagens', { erros: erros })

    }
    //senão, significa que nenhum erro foi adcionado e ta tudo ok!
    //aqui serão inseridas as postagens
    else {

        const novaPostagem = {
            titulo: req.body.titulo,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria,
            slug: req.body.slug
        }

        new Postagem(novaPostagem).save().then(() => {
            req.flash("success_msg", "Postagem realizada com sucesso !")
            res.redirect("/admin/postagens")
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao salvar a postagem" + err)
            res.redirect('/admin/postagens')
        })

    }
});
///////deletar postagem///////////

router.get('/postagens/deletar/:id', (req, res) => {
    Postagem.remove({ _id: req.params.id }).then(() => {
        req.flash("success_msg", "Postagem deletada com Sucesso");
        res.redirect('/admin/postagens')
    }).catch((err) => {
        req.flash("error_msg", "Erro ao deletar a postagem")
        res.redirect('/admin/postagens')
    })
})




// criando categoria 
router.post("/categorias/nova", (req, res) => {
    //configuração de erro
    var erros = [];
    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({
            texto: "nome invalido"
        })
    }
    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
        erros.push({
            texto: "slug inválido"
        })
    }
    if (req.body.nome.length < 2) {
        erros.push({
            texto: "Nome de categoria é muito pequeno"
        });
    }
    if (erros.length > 0) {
        res.render("admin/addcategorias", {
            erros: erros
        });

    } else {

        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }

        new Categoria(novaCategoria).save().then(() => {

            /*caso aja sucesso, a variavel success_msg recebe "categoria
             criada com sucesso*/
            req.flash("success_msg", "categoria criada com sucesso")
            res.redirect("/admin/categorias");
        }).catch((err) => {
            /*erro_msg recebe houvve um erro ao salvar a categoria  */
            req.flash("erro_msg", "Houve um erro ao salvar a categoria!")
            res.redirect("/admin")
        })
    }
    //fim configuração de erro





});



module.exports = router;