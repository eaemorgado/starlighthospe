var express = require("express");
const { body } = require("express-validator");
var router = express.Router();
var mysql = require("mysql2");
const uuid = require('uuid');
var bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(10);



const db = mysql.createConnection({
    host: "roundhouse.proxy.rlwy.net",
    user: "root",
    password: "bDg3hd6BGAE6BaD3EdE13b13BBeG43H3",
    database: "Tables",
    port: 28025  
  });





  // async function creatTables(){
  //   await db.connect()

  //   await db.query(`CREATE TABLE usuarios(
  //     id varchar(200) primary key,
  //     nome varchar(255) NOT NULL,
  //     usuario varchar(50) NOT NULL,
  //     email varchar(60) NOT NULL,
  //     senha varchar(200) NOT NULL,
  //     id_tipo_usuario int not null default '1'
  //   )`)

  //   await db.query(`CREATE TABLE noticia(
  //     id_noticia varchar(200) primary key,
  //     titulo_noticia varchar(255) NOT NULL,
  //     descricao_noticia varchar(250) NOT NULL,
  //     data_noticia varchar(60) NOT NULL,
  //     situacao_noticia varchar(200) NOT NULL
  //   )`)

  //   await db.query(`CREATE TABLE tipo_usuario(
  //     id_tipo_usuario int not null auto_increment,
  //     tipo_usuario varchar (25) default null,
  //     inscricao_usuario varchar (155) default null,
  //     status_tipo_usuario int default '1',
  //     primary key (id_tipo_usuario)
  //   )`)

  //   await db.end()

      
  //   console.log("Tabelas Criadas")
  // }


  // creatTables()







  var { verificarUsuAutenticado, limparSessao, gravarUsuAutenticado, verificarUsuAutorizado } = require("../models/autenticador_middleware");
  var UsuarioDAL = require("../models/UsuarioDAL");
    var usuarioDAL = new UsuarioDAL(db);



    var NoticiaDAL = require("../models/NoticiaDAL");
    var noticiaDAL = new NoticiaDAL(db);

  const {validationResult } = require("express-validator");

function myMiddleware(req, res, next) {
    // Your middleware logic here
    next(); // Call next to continue to the next middleware or route handler
  }

  router.use(myMiddleware);


  router.get("/sair", limparSessao, function (req, res) {
    res.redirect("/");
  });
  
  router.get("/", verificarUsuAutenticado, async function (req, res) {
    req.session.autenticado.login = req.query.login;
    res.render("pages/home", req.session.autenticado);
  });

  router.get("/home", verificarUsuAutenticado, function (req, res) {
    req.session.autenticado.login = req.query.login;
    res.render("pages/home", req.session.autenticado);
  });

  router.get("/usuario", verificarUsuAutenticado, function (req, res) {
    if (req.session.autenticado.autenticado == null) {
      res.render("pages/login")
  } else {
      res.render("pages/usuario",{autenticado: req.session.autenticado, retorno: null, erros: null})}
  
  });

  

router.get("/cadastro", function(req, res){
    res.render("pages/cadastro", {retorno: null, erros: null})}
);

router.get("/eventos", function(req, res){
    res.render("pages/eventos", {retorno: null, erros: null})}
);

router.get("/index-adm", function(req, res){
    res.render("pages/index-adm", {retorno: null, erros: null})}
);

router.get("/login", function(req, res){
    res.render("pages/login", {retorno: null, erros: null})}
);

router.get("/noticias-form", function(req, res){
    res.render("pages/noticias-form", {retorno: null, erros: null})}
);

router.get("/noticias", async function(req, res){
  try {

    let pagina = req.query.pagina == undefined ? 1 : req.query.pagina;
      
    inicio = parseInt(pagina - 1) * 5
    results = await noticiaDAL.FindPage(inicio, 5);
    totReg = await noticiaDAL.TotalReg();
    console.log(results)

    totPaginas = Math.ceil(totReg[0].total / 5);

    var paginador = totReg[0].total <= 5 ? null : { "pagina_atual": pagina, "total_reg": totReg[0].total, "total_paginas": totPaginas }

    console.log("auth --> ")
    console.log(req.session.autenticado)
    res.render("pages/noticias",{ noticias: results, paginador: paginador, autenticado:req.session.autenticado, login: req.res.autenticado} );
  } catch (e) {
    console.log(e); // console log the error so we can see it in the console
    res.json({ erro: "Falha ao acessar dados" });
  }    
}
);

router.get("/paineladministrativo", verificarUsuAutorizado([2, 3], ("pages/restrito")), function (req, res){
  req.session.autenticado.login = req.query.login;
  res.render("pages/paineladministrativo", req.session.autenticado)
}
)



router.get("/noticiasadm", verificarUsuAutorizado([2, 3], ("pages/restrito")), async function(req, res){
  try {

    let pagina = req.query.pagina == undefined ? 1 : req.query.pagina;
      
    inicio = parseInt(pagina - 1) * 10
    results = await noticiaDAL.FindPage(inicio, 10);
    totReg = await noticiaDAL.TotalReg();
    console.log(results)

    totPaginas = Math.ceil(totReg[0].total / 10);

    var paginador = totReg[0].total <= 10 ? null : { "pagina_atual": pagina, "total_reg": totReg[0].total, "total_paginas": totPaginas }

    console.log("auth --> ")
    console.log(req.session.autenticado)
    res.render("pages/noticiasadm",{ noticias: results, paginador: paginador, autenticado:req.session.autenticado, login: req.res.autenticado} );
  } catch (e) {
    console.log(e); // console log the error so we can see it in the console
    res.json({ erro: "Falha ao acessar dados" });
  }    
}
);

router.get("/excluirnoticia/:id", function (req, res) {
  var query = db.query(
    "DELETE FROM noticia WHERE ?",
    { id_noticia: req.params.id },
    function (error, results, fields) {
      if (error) throw error;
    }
  );  

  res.redirect("/noticiasadm");
});


router.get("/formadd", verificarUsuAutorizado([2, 3], ("pages/login")), function (req, res){
  req.session.autenticado.login = req.query.login;
  res.render("pages/formadd", req.session.autenticado)
}
);


router.get("/politicapriv", function(req, res){
  res.render("pages/politicapriv", {retorno: null, erros: null})}
);

router.get("/restaurantes", function(req, res){
    res.render("pages/restaurantes", {retorno: null, erros: null})}
);

router.get("/sobre", function(req, res){
    res.render("pages/sobre", {retorno: null, erros: null})}
);

router.get("/loja", function(req, res){
    res.render("pages/loja", {retorno: null, erros: null})}
);

router.get("/comoajudar", function(req, res){
    res.render("pages/comoajudar", {retorno: null, erros: null})}
);




router.get("/formenviado", function(req, res){
    res.render("pages/formenviado", {retorno: null, erros: null})}
);

router.get("/adm", verificarUsuAutorizado([3], "pages/restrito"), async function(req, res){
    try {

        let pagina = req.query.pagina == undefined ? 1 : req.query.pagina;
          
        inicio = parseInt(pagina - 1) * 5
        results = await usuarioDAL.FindPage(inicio, 5);
        totReg = await usuarioDAL.TotalReg();
        console.log(results)
    
        totPaginas = Math.ceil(totReg[0].total / 5);
    
        var paginador = totReg[0].total <= 5 ? null : { "pagina_atual": pagina, "total_reg": totReg[0].total, "total_paginas": totPaginas }
    
        console.log("auth --> ")
        console.log(req.session.autenticado)
        res.render("pages/adm",{ usuarios: results, paginador: paginador, autenticado:req.session.autenticado} );
      } catch (e) {
        console.log(e); // console log the error so we can see it in the console
        res.json({ erro: "Falha ao acessar dados" });
      }
    
    
     res.render("pages/adm", {usuarios: results, retorno: null, erros: null, autenticado: req.session.autenticado})
} );

router.get("/excluir/:id", function (req, res) {
    var query = db.query(
      "DELETE FROM usuarios WHERE ?",
      { id: req.params.id },
      function (error, results, fields) {
        if (error) throw error;
      }
    );  
  
    res.redirect("/adm");
  });
  


// router.post('/formadd', (req, res) => {
//     res.redirect('/');
// });

// application.get('/postagem/:id', (req, res) =>{
//     res.render('/postagem');
// });

// app.get('editar-mensagem/:id', (req, res) =>{
//     res.render('Editar postagem');
// });

// app.post('/atualizar-postagem/:id', (req, res) =>{
//     res.redirect('/');
// });

// app.post('/excluir-postagem/:id', (req, res) =>{
//     res.redirect('/')
// })

// app.post('/adicionar', (req, res) => {
//     cont {titulo, conteudo} = req.body;
    
//     if (!titulo || !conteudo) {
//         res.status(400).send('Título e conteúdo são obrigatórios.');
//         return;

//     }

//     const postagem = {titulo, conteudo};
    
// })   

// router.post("/cadastrar", function(req, res){
//     var dadosForm = {
//         email: req.body.email
//     }.then(function(){
//         res.render("pages/formenviado")
//     }).catch(function(erro){
//         res.send("Houve um erro: " + erro)
//     })
// });


router.post("/adicionar", verificarUsuAutorizado([2, 3], "pages/restrito"), function(req, res){
    const dadosNoticia = {
        titulo_noticia: req.body.titulo_noticia,
        descricao_noticia: req.body.descricao_noticia,
        data_noticia: req.body.data_noticia,
        situacao_noticia: req.body.situacao_noticia
    }

    const {titulo_noticia, descricao_noticia} = req.body;


    if (!titulo_noticia || !descricao_noticia) {
        return res.send('Por favor, preencha todos os campos.');
      }
    

      const id_noticia = uuid.v4();


      const query = 'INSERT INTO noticia (id_noticia, titulo_noticia, descricao_noticia, data_noticia, situacao_noticia) VALUES (?, ?, ?, ?, ?)';
      const values = [id_noticia, dadosNoticia.titulo_noticia, dadosNoticia.descricao_noticia, dadosNoticia.data_noticia, dadosNoticia.situacao_noticia];

      db.query(query, values, (err, result) => {
        if (err) {
          console.error('Erro ao inserir dados no banco de dados:', err);
        } else {
          console.log('Dados inseridos com sucesso!');
        }
      });

      setTimeout(function () {
        res.render("pages/noticias", { titulo_noticia: dadosNoticia.titulo_noticia });
      }, 1000); 

      console.log(dadosNoticia);
  
})

router.post("/cadastrar", 
    body("email")
    .isEmail({min:5, max:50})
    .withMessage("O email deve ser válido"),
    body("senha")
    .isStrongPassword()
    .withMessage("A senha deve ser válida"),

    async function(req, res){
    
    const dadosForm = {
        nome: req.body.nome,
        usuario: req.body.usuario,
        email: req.body.email,
        senha: bcrypt.hashSync(req.body.senha, salt)
    }
    if (!dadosForm.email || !dadosForm.senha) {
        return res.status(400).send('Por favor, preencha todos os campos.');
    }
    const id = uuid.v4();

    const query = 'INSERT INTO usuarios (id, nome, usuario, email, senha) VALUES (?, ?, ?, ?, ?)';
    const values = [id, dadosForm.nome, dadosForm.usuario, dadosForm.email, dadosForm.senha];

    // db.query(query, values, (err, result) => {
    //     if (err) {
    //       console.error('Erro ao inserir dados no banco de dados:', err);
    //     } else {
    //       console.log('Dados inseridos com sucesso!');
    //     }
    //   });

      

      setTimeout(function () {
        res.render("pages/formenviado", { email: dadosForm.email });
      }, 1000); 

      console.log(dadosForm)    
})


router.post(
    "/login",
    body("email")
      .isLength({ min: 4, max: 45 })
      .withMessage("O nome de usuário/e-mail deve ter de 8 a 45 caracteres"),
    body("senha")
      .isStrongPassword()
      .withMessage("A senha deve ter no mínimo 8 caracteres (mínimo 1 letra maiúscula, 1 caractere especial e 1 número)"),
  
    gravarUsuAutenticado(usuarioDAL, bcrypt),
    
    function (req, res) {
      const erros = validationResult(req);
      if (!erros.isEmpty()) {
        
        return res.render("pages/login", { listaErros: erros, dadosNotificacao: null, autenticado: null })
      }
      if (req.session.autenticado != null) {
        //mudar para página de perfil quando existir
        res.redirect("/?login=logado");
      } else {
        res.render("pages/login", { listaErros: erros, autenticado: req.session.autenticado, dadosNotificacao: { titulo: "Erro ao logar!", mensagem: "E-mail e/ou senha inválidos!", tipo: "error" } })
      }
});
  

//   router.post(
//     "/login",
//     body("email")
//         .isEmail({min:5, max:50})
//         .withMessage("O email deve ser válido"),
//     body("senha")
//         .isStrongPassword()
//         .withMessage("A senha deve ser válida"),



//     // gravarUsuAutenticado(usuarioDAL, bcrypt),
//     function(req, res){

//         const dadosForm = {
//             email: req.body.email,
//             senha: req.body.senha
//         }
//         if (!dadosForm.email || !dadosForm.senha) {
//             return res.status(400).send('Por favor, preencha todos os campos.');
//         }
//          const errors = validationResult(req)
//          if(!errors.isEmpty()){
//              console.log(errors);    
//              return res.render("pages/login", {retorno: null, listaErros: errors, valores: req.body});
//          }
//         // if(req.session.autenticado != null) {
//         //    res.redirect("/");
//         // } else {
//         //      res.render("pages/login", { listaErros: null, retorno: null, valores: req.body})
//         //  }

//         setTimeout(function () {
//              res.render("pages/home", { email: dadosForm.email });
//            }, 1000); 
//     });



module.exports = router;