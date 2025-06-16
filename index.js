import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";

//assegure que essa porta não esteja sendo usada por aplicação no seu computador.

const host = "0.0.0.0"; //todas as interfaces
const port = 3000;
var listadeEquipes = [];
var listadeJogadores = [];

//aplicação servidora
const app = express();

//processamento do formulario
app.use(express.urlencoded({extended: true}));

//Preparando a aplicação para fazer uso de sessão
//adicionando à aplicação o middleware session

app.use(session({
    secret: "M1nh4Ch4v3S3cr3t4",
    resave: false,
    saveUninitialized: false,
    cookie: { //definir o tempo de vida útil de uma sessão
        maxAge: 1000 * 60 * 30, //depois de 30 minutos de inatividade do usuário a sessão será excluída
        httpOnly: true,
        secure: false //true se for https
    }
}));

//Adicionando o middleware cookieParser na aplicação
//para permitir que nossa aplicação consiga ler e escrever cookies no navegador de um usuário
app.use(cookieParser());

app.get("/", verificarAutenticacao, (requisicao, resposta) =>{
    const ultimoLogin = requisicao.cookies.ultimoLogin;
    resposta.send(`
            <html lang="pt-br">
                <head>
                    <meta charset="UFT-8">
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-4Q6Gf2aSP4eDXB8Miphtr37CMZZQ5oXLH2yaXMJ2w8e2ZtHTl7GptT4jmndRuHDT" crossorigin="anonymous">
                    <title>Página inicial do aplicativo</title>
                </head>
                <body>
                    <nav class="navbar navbar-expand-lg bg-body-tertiary">
                        <div class="container-fluid">
                            <a class="navbar-brand" href="#">Menu do Sistema</a>
                                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                                    <span class="navbar-toggler-icon"></span>
                                </button>
                            <div class="collapse navbar-collapse" id="navbarNavDropdown">
                                <ul class="navbar-nav">
                                    <li class="nav-item dropdown">
                                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            Cadastros
                                        </a>
                                        <ul class="dropdown-menu">
                                            <li><a class="dropdown-item" href="/cadastroEquipes">Cadastro de Equipes</a></li>
                                            <li><hr class="dropdown-divider"></li>
                                            <li><a class="dropdown-item" href="/cadastroJogadores">Cadastro de Jogadores</a></li>
                                        </ul>
                                    </li>
                                    <li class="nav-item">
                                        <a class="nav-link" href="/logout">Sair</a>
                                    </li>
                                </ul>
                                <span class="navbar-text">${ultimoLogin?"Ultimo login: " + ultimoLogin:""}</span>
                            </div>
                        </div>
                    </nav>
                </body>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js" integrity="sha384-j1CDi7MgGQ12Z7Qab0qlWQ/Qqz24Gc6BM0thvEMVjHnfYGF0rmFCozFSxQBxwHKO" crossorigin="anonymous"></script>
            </html>
        `);
        resposta.end();
});

app.get("/cadastroEquipes", verificarAutenticacao, (requisicao, resposta) =>{
    resposta.send(`
        <html lang="pt-br">
            <head>
                <meta charset="UFT-8">
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-4Q6Gf2aSP4eDXB8Miphtr37CMZZQ5oXLH2yaXMJ2w8e2ZtHTl7GptT4jmndRuHDT" crossorigin="anonymous">
                    <title>Página inicial do aplicativo</title>
            </head>
            <body>
                <div class="container w-75 mb-5 mt-5">
                    <form method="POST" action="/cadastroEquipes" class="row g-3 border p-2" novalidate>
                        <fieldset>
                            <legend class="text-center">Cadastro de Equipes</legend>
                        </fieldset>
                        <div class="col-md-4">
                            <label for="nomeequipe" class="form-label">Nome da Equipe</label>
                            <input type="text" class="form-control" id="nomeequipe" name="nomeequipe" required>
                        </div>
                        <div class="col-md-4">
                            <label for="nometecnico" class="form-label">Nome do Técnico</label>
                            <input type="text" class="form-control" id="nometecnico" name="nometecnico" required>
                        </div>
                        <div class="col-md-6">
                            <label for="telefonetecnico" class="form-label">Contato do técnico (Telefone)</label>
                            <input type="text" class="form-control" id="telefonetecnico" name="telefonetecnico" required>
                        </div>                           
                        <div class="col-12">
                            <button class="btn btn-primary" type="submit">Cadastre-se</button>
                            <a class="btn btn-secondary" href="/">Voltar</a>
                        </div>
                    </form>
                </div>
            </body>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js" integrity="sha384-j1CDi7MgGQ12Z7Qab0qlWQ/Qqz24Gc6BM0thvEMVjHnfYGF0rmFCozFSxQBxwHKO" crossorigin="anonymous"></script>
        </html>
    `);
    resposta.end();

});

app.post("/cadastroEquipes", verificarAutenticacao, (requisicao, resposta) => {
    const nomeequipe = requisicao.body.nomeequipe;
    const nometecnico = requisicao.body.nometecnico;
    const telefonetecnico = requisicao.body.telefonetecnico;

    if(nomeequipe && nometecnico && telefonetecnico){
        listadeEquipes.push({
            nomeequipe: nomeequipe,
            nometecnico: nometecnico,
            telefonetecnico: telefonetecnico,

        });
        resposta.redirect("/listadeEquipes");
    }
    else{
    
    let conteudo = `
        <html lang="pt-br">
            <head>
                <meta charset="UFT-8">
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-4Q6Gf2aSP4eDXB8Miphtr37CMZZQ5oXLH2yaXMJ2w8e2ZtHTl7GptT4jmndRuHDT" crossorigin="anonymous">
                    <title>Página inicial do aplicativo</title>
            </head>
            <body>
                <div class="container w-75 mb-5 mt-5">
                    <form method="POST" action="/cadastroEquipes" class="row g-3 border p-2" novalidate>
                        <fieldset>
                            <legend class="text-center">Cadastro de Equipes</legend>
                        </fieldset>
                        <div class="col-md-4"> `;
                        if(!nomeequipe){
                            conteudo = conteudo + `<label for="nomeequipe" class="form-label">Nome da Equipe</label>
                                                    <input type="text" class="form-control" id="nomeequipe" name="nomeequipe" required>
                                                    <span class="text-danger">Informe o Nome da Equipe</span>`;
                        }
                        else{
                            conteudo = conteudo + `
                                                <label for="nomeequipe" class="form-label">Nome da Equipe</label>
                                                <input type="text" class="form-control" id="nomeequipe" name="nomeequipe" value="${nomeequipe}" required>
                                                `;
                        }
                            
                        conteudo = conteudo + `</div>
                                                <div class="col-md-4"> `;
                                                if(!nometecnico){
                                                    conteudo = conteudo + `
                                                    <label for="nometecnico" class="form-label">Nome do Técnico</label>
                                                    <input type="text" class="form-control" id="nometecnico" name="nometecnico" required>
                                                    <span class="text-danger">Informe o Nome do Técnico</span>`;
                                                }
                                                else{
                                                    conteudo = conteudo + `
                                                                        <label for="nometecnico" class="form-label">Nome do Técnico</label>
                                                                        <input type="text" class="form-control" id="nometecnico" name="nometecnico" value="${nometecnico}"required>
                                                                        `;
                                                }
                            
                        conteudo = conteudo + `</div>
                                                <div class="col-md-4">
                                                    <label for="telefonetecnico" class="form-label">Contato do Técnico (Telefone)</label>
                                                <div class="input-group"> ` ;
                                                if (!telefonetecnico){
                                                    conteudo = conteudo + `
                                                                        <input type="text" class="form-control" id="telefonetecnico" name="telefonetecnico" aria-describedby="inputGroupPrepend" required>
                                                                        <span class="text-danger">Informe o Contato do Técnico (Telefone)</span>`;
                                                }
                                                else{
                                                    conteudo = conteudo + `
                                                                        <input type="text" class="form-control" id="telefonetecnico" name="telefonetecnico" value="${telefonetecnico}" aria-describedby="inputGroupPrepend" required>`;
                                                }

                                                    conteudo = conteudo + `
                                                                    </div>                           
                                                                    <div class="col-12">
                                                                        <button class="btn btn-primary" type="submit">Cadastre-se</button>
                                                                        <a class="btn btn-secondary" href="/">Voltar</a>
                            </div>
                    </form>
                </div>
            </body>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js" integrity="sha384-j1CDi7MgGQ12Z7Qab0qlWQ/Qqz24Gc6BM0thvEMVjHnfYGF0rmFCozFSxQBxwHKO" crossorigin="anonymous"></script>
        </html>`;
    resposta.send(conteudo);
    resposta.end();
    }
});

app.get("/listadeEquipes", verificarAutenticacao, (requisicao, resposta) => {
    let conteudo= `
        <html lang="pt-br">
            <head>
                <meta charset="UFT-8">
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-4Q6Gf2aSP4eDXB8Miphtr37CMZZQ5oXLH2yaXMJ2w8e2ZtHTl7GptT4jmndRuHDT" crossorigin="anonymous">
                    <title>Página inicial do aplicativo</title>
            </head>
            <body>
                <div class="container w-75 mb-5 mt-5">
                    <table class="table table-dark table-striped table-hover">
                        <thead>
                            <tr>
                                <th scope="col">Nome da Equipe</th>
                                <th scope="col">Nome do Técnico</th>
                                <th scope="col">Contato do Técnico (Telefone)</th>
                            </tr>
                        </thead>
                        <tbody> `;
                        for(let i = 0; i < listadeEquipes.length; i++){
                            conteudo = conteudo + `
                                <tr>
                                    <td>${listadeEquipes[i].nomeequipe}</td>
                                    <td>${listadeEquipes[i].nometecnico}</td>
                                    <td>${listadeEquipes[i].telefonetecnico}</td>
                                </tr>
                            `;
                        }
conteudo = conteudo + ` </tbody>
                    </table>
                    <a class="btn btn-secondary" href="/cadastroEquipes">Seguir Cadastrando....</a>
                </div>
            </body>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js" integrity="sha384-j1CDi7MgGQ12Z7Qab0qlWQ/Qqz24Gc6BM0thvEMVjHnfYGF0rmFCozFSxQBxwHKO" crossorigin="anonymous"></script>
        </html>`
    resposta.send(conteudo);
    resposta.end();
});

app.get("/cadastroJogadores", verificarAutenticacao, (requisicao, resposta) =>{
    resposta.send(`
        <html lang="pt-br">
            <head>
                <meta charset="UFT-8">
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-4Q6Gf2aSP4eDXB8Miphtr37CMZZQ5oXLH2yaXMJ2w8e2ZtHTl7GptT4jmndRuHDT" crossorigin="anonymous">
                    <title>Página inicial do aplicativo</title>
            </head>
            <body>
                <div class="container w-75 mb-5 mt-5">
                    <form method="POST" action="/cadastroJogadores" class="row g-3 border p-2" novalidate>
                        <fieldset>
                            <legend class="text-center">Cadastro de Jogadores</legend>
                        </fieldset>
                        <div class="col-md-4">
                            <label for="nomejogador" class="form-label">Nome do Jogador</label>
                            <input type="text" class="form-control" id="nomejogador" name="nomejogador" required>
                        </div>
                        <div class="col-md-4">
                            <label for="numerojogador" class="form-label">Número do Jogador (nº da camisa)</label>
                            <input type="text" class="form-control" id="numerojogador" name="numerojogador" required>
                        </div>
                        <div class="col-md-4">
                            <label for="datanascimento" class="form-label">Data de Nascimento</label>
                            <input type="text" class="form-control" id="datanascimento" name="datanascimento" required>
                        </div>
                        <div class="col-md-6">
                            <label for="altura" class="form-label">Altura em centímetros</label>
                            <input type="text" class="form-control" id="altura" name="altura" required>
                        </div>
                        <div class="col-md-6">
                            <label for="genero" class="form-label">Gênero (sexo)</label>
                            <input type="text" class="form-control" id="genero" name="genero" required>
                        </div>
                        <div class="col-md-3">
                            <label for="posicao" class="form-label">Posição</label>
                            <input type="text" class="form-control" id="posicao" name="posicao" required>
                        </div>
                        <div class="col-md-3">
                            <label for="equipe" class="form-label">Equipe</label>
                            <input type="text" class="form-control" id="equipe" name="equipe" required>
                        </div>                           
                        <div class="col-12">
                            <button class="btn btn-primary" type="submit">Cadastre o jogador</button>
                            <a class="btn btn-secondary" href="/">Voltar</a>
                        </div>
                    </form>
                </div>
            </body>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js" integrity="sha384-j1CDi7MgGQ12Z7Qab0qlWQ/Qqz24Gc6BM0thvEMVjHnfYGF0rmFCozFSxQBxwHKO" crossorigin="anonymous"></script>
        </html>
    `);
    resposta.end();

});

app.post("/cadastroJogadores", verificarAutenticacao, (requisicao, resposta) => {
    const nomejogador = requisicao.body.nomejogador;
    const numerojogador = requisicao.body.numerojogador;
    const datanascimento = requisicao.body.datanascimento;
    const altura = requisicao.body.altura;
    const genero = requisicao.body.genero;
    const posicao = requisicao.body.posicao;
    const equipe = requisicao.body.equipe;

    if(nomejogador && numerojogador && datanascimento && altura && genero && posicao && equipe){
        listadeJogadores.push({
            nomejogador: nomejogador,
            numerojogador: numerojogador,
            datanascimento: datanascimento,
            altura: altura,
            genero: genero,
            posicao: posicao,
            equipe: equipe,

        });
        resposta.redirect("/listadeJogadores");
    }
    else{
    
    let conteudo = `
        <html lang="pt-br">
            <head>
                <meta charset="UFT-8">
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-4Q6Gf2aSP4eDXB8Miphtr37CMZZQ5oXLH2yaXMJ2w8e2ZtHTl7GptT4jmndRuHDT" crossorigin="anonymous">
                    <title>Página inicial do aplicativo</title>
            </head>
            <body>
                <div class="container w-75 mb-5 mt-5">
                    <form method="POST" action="/cadastroJogadores" class="row g-3 border p-2" novalidate>
                        <fieldset>
                            <legend class="text-center">Cadastro de Jogadores</legend>
                        </fieldset>
                        <div class="col-md-4"> `;
                        if(!nomejogador){
                            conteudo = conteudo + `<label for="nomejogador" class="form-label">Nome do Jogador</label>
                                                    <input type="text" class="form-control" id="nomejogador" name="nomejogador" required>
                                                    <span class="text-danger">Informe o Nome do Jogador</span>`;
                        }
                        else{
                            conteudo = conteudo + `
                                                <label for="nomejogador" class="form-label">Nome do Jogador</label>
                                                <input type="text" class="form-control" id="nomejogador" name="nomejogador" value="${nomejogador}" required>
                                                `;
                        }
                            
                        conteudo = conteudo + `</div>
                                                <div class="col-md-4"> `;
                                                if(!numerojogador){
                                                    conteudo = conteudo + `
                                                    <label for="numerojogador" class="form-label">Número do jogador</label>
                                                    <input type="text" class="form-control" id="numerojogador" name="numerojogador" required>
                                                    <span class="text-danger">Informe o Número do Jogador</span>`;
                                                }
                                                else{
                                                    conteudo = conteudo + `
                                                                        <label for="numerojogador" class="form-label">Número do jogador</label>
                                                                        <input type="text" class="form-control" id="numerojogador" name="numerojogador" value="${numerojogador}"required>
                                                                        `;
                                                }
                            
                        conteudo = conteudo + `</div>
                                                <div class="col-md-4"> ` ;
                                                if (!datanascimento){
                                                    conteudo = conteudo + `
                                                                        <label for="datanascimento" class="form-label">Data de nascimento</label>
                                                                        <input type="text" class="form-control" id="datanascimento" name="datanascimento" required>
                                                                        <span class="text-danger">Informe a Data de nascimento</span>`;
                                                }
                                                else{
                                                    conteudo = conteudo + `
                                                                        <label for="datanascimento" class="form-label">Data de nascimento</label>
                                                                        <input type="text" class="form-control" id="datanascimento" name="datanascimento" value="${datanascimento}" required>`;
                                                }

                                                    conteudo = conteudo + `
                                                                        </div>
                                                                        <div class="col-md-3">
                                                                            <label for="altura" class="form-label">Altura em Centímetros</label>`;
                                                        if(!altura){
                                                            conteudo = conteudo + `
                                                                            <input type="text" class="form-control" id="altura" name="altura" required>
                                                                            <span class="text-danger">Informe a Altura em Centímetros</span>`;
                                                        }
                                                        else{
                                                            conteudo = conteudo + `
                                                                                    <input type="text" class="form-control" id="altura" name="altura" value=${altura} required>
                                                            `;
                                                        }
                                                    conteudo = conteudo + ` 
                                                                        </div>
                                                                        </div>
                                                                        <div class="col-md-6"> `;
                                                    if(!genero){
                                                        conteudo = conteudo + 
                                                                            `<label for="genero" class="form-label">Gênero (sexo)</label>
                                                                            <input type="text" class="form-control" id="genero" name="genero" required>
                                                                            <span class="text-danger">Por favor informe o Gênero!!</span>`;
                                                    }
                                                    else{
                                                        conteudo = conteudo + `
                                                                        <label for="genero" class="form-label">Gênero (sexo)</label>
                                                                        <input type="text" class="form-control" id="genero" name="genero" value="${genero}"required>`;
                                                    }
                                                    conteudo = conteudo + `
                                                                    </div>
                                                                    <div class="col-md-3">
                                                                        <label for="posicao" class="form-label">Posição de jogo</label>`;
                                                    if(!posicao){
                                                        conteudo = conteudo + `
                                                                        <input type="text" class="form-control" id="posicao" name="posicao" required>
                                                                        <span class="text-danger">Informe a Posição de jogo, por favor!!</span>`;
                                                    }
                                                    else{
                                                        conteudo = conteudo + `
                                                                                <input type="text" class="form-control" id="posicao" name="posicao" value=${posicao} required>
                                                        `;
                                                    }
                                                    conteudo = conteudo + `
                                                                    </div>
                                                                    <div class="col-md-3">
                                                                        <label for="equipe" class="form-label">Nome da Equipe</label>`;
                                                    if(!equipe){
                                                        conteudo = conteudo + `
                                                                        <input type="text" class="form-control" id="equipe" name="equipe" required>
                                                                        <span class="text-danger">Informe o Nome da equipe, por favor!!</span>`;
                                                    }
                                                    else{
                                                        conteudo = conteudo + `
                                                                                <input type="text" class="form-control" id="equipe" name="equipe" value=${equipe} required>
                                                        `;
                                                    }
                                                    conteudo = conteudo + `
                                                                    </div>                           
                                                                    <div class="col-12">
                                                                        <button class="btn btn-primary" type="submit">Cadastre o jogador</button>
                                                                        <a class="btn btn-secondary" href="/">Voltar</a>
                            </div>
                    </form>
                </div>
            </body>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js" integrity="sha384-j1CDi7MgGQ12Z7Qab0qlWQ/Qqz24Gc6BM0thvEMVjHnfYGF0rmFCozFSxQBxwHKO" crossorigin="anonymous"></script>
        </html>`;
    resposta.send(conteudo);
    resposta.end();
    }
});

app.get("/listadeJogadores", verificarAutenticacao, (requisicao, resposta) => {
    let conteudo= `
        <html lang="pt-br">
            <head>
                <meta charset="UFT-8">
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-4Q6Gf2aSP4eDXB8Miphtr37CMZZQ5oXLH2yaXMJ2w8e2ZtHTl7GptT4jmndRuHDT" crossorigin="anonymous">
                    <title>Página inicial do aplicativo</title>
            </head>
            <body>
                <div class="container w-75 mb-5 mt-5">
                    <table class="table table-dark table-striped table-hover">
                        <thead>
                            <tr>
                                <th scope="col">Nome do Jogador</th>
                                <th scope="col">Número do Jogador (nº da camisa)</th>
                                <th scope="col">Data de Nascimento</th>
                                <th scope="col">Altura em centímetros</th>
                                <th scope="col">Gênero (sexo)</th>
                                <th scope="col">Posição</th>
                                <th scope="col">Equipe</th>
                            </tr>
                        </thead>
                        <tbody> `;
                        for(let i = 0; i < listadeJogadores.length; i++){
                            conteudo = conteudo + `
                                <tr>
                                    <td>${listadeJogadores[i].nomejogador}</td>
                                    <td>${listadeJogadores[i].numerojogador}</td>
                                    <td>${listadeJogadores[i].datanascimento}</td>
                                    <td>${listadeJogadores[i].altura}</td>
                                    <td>${listadeJogadores[i].genero}</td>
                                    <td>${listadeJogadores[i].posicao}</td>
                                    <td>${listadeJogadores[i].equipe}</td>
                                </tr>
                            `;
                        }
conteudo = conteudo + ` </tbody>
                    </table>
                    <a class="btn btn-secondary" href="/cadastroJogadores">Seguir Cadastrando....</a>
                </div>
            </body>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js" integrity="sha384-j1CDi7MgGQ12Z7Qab0qlWQ/Qqz24Gc6BM0thvEMVjHnfYGF0rmFCozFSxQBxwHKO" crossorigin="anonymous"></script>
        </html>`
    resposta.send(conteudo);
    resposta.end();
});

app.get("/login", (requisicao, resposta)=>{
    resposta.send(`
        <html lang="pt-br">
            <head>
                <meta charset="UFT-8">
                <link href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.0/css/bootstrap.min.css" rel="stylesheet" id="bootstrap-css">
                    <title>Login do Sistema</title>
                    <style>
                        body {
                            padding-top: 90px;
                        }
                        .panel-login {
                            border-color: #ccc;
                            -webkit-box-shadow: 0px 2px 3px 0px rgba(0,0,0,0.2);
                            -moz-box-shadow: 0px 2px 3px 0px rgba(0,0,0,0.2);
                            box-shadow: 0px 2px 3px 0px rgba(0,0,0,0.2);
                        }
                        .panel-login>.panel-heading {
                            color: #00415d;
                            background-color: #fff;
                            border-color: #fff;
                            text-align:center;
                        }
                        .panel-login>.panel-heading a{
                            text-decoration: none;
                            color: #666;
                            font-weight: bold;
                            font-size: 15px;
                            -webkit-transition: all 0.1s linear;
                            -moz-transition: all 0.1s linear;
                            transition: all 0.1s linear;
                        }
                        .panel-login>.panel-heading a.active{
                            color: #029f5b;
                            font-size: 18px;
                        }
                        .panel-login>.panel-heading hr{
                            margin-top: 10px;
                            margin-bottom: 0px;
                            clear: both;
                            border: 0;
                            height: 1px;
                            background-image: -webkit-linear-gradient(left,rgba(0, 0, 0, 0),rgba(0, 0, 0, 0.15),rgba(0, 0, 0, 0));
                            background-image: -moz-linear-gradient(left,rgba(0,0,0,0),rgba(0,0,0,0.15),rgba(0,0,0,0));
                            background-image: -ms-linear-gradient(left,rgba(0,0,0,0),rgba(0,0,0,0.15),rgba(0,0,0,0));
                            background-image: -o-linear-gradient(left,rgba(0,0,0,0),rgba(0,0,0,0.15),rgba(0,0,0,0));
                        }
                        .panel-login input[type="text"],.panel-login input[type="email"],.panel-login input[type="password"] {
                            height: 45px;
                            border: 1px solid #ddd;
                            font-size: 16px;
                            -webkit-transition: all 0.1s linear;
                            -moz-transition: all 0.1s linear;
                            transition: all 0.1s linear;
                        }
                        .panel-login input:hover,
                        .panel-login input:focus {
                            outline:none;
                            -webkit-box-shadow: none;
                            -moz-box-shadow: none;
                            box-shadow: none;
                            border-color: #ccc;
                        }
                        .btn-login {
                            background-color: #59B2E0;
                            outline: none;
                            color: #fff;
                            font-size: 14px;
                            height: auto;
                            font-weight: normal;
                            padding: 14px 0;
                            text-transform: uppercase;
                            border-color: #59B2E6;
                        }
                        .btn-login:hover,
                        .btn-login:focus {
                            color: #fff;
                            background-color: #53A3CD;
                            border-color: #53A3CD;
                        }
                        .forgot-password {
                            text-decoration: underline;
                            color: #888;
                        }
                        .forgot-password:hover,
                        .forgot-password:focus {
                            text-decoration: underline;
                            color: #666;
                        }

                        .btn-register {
                            background-color: #1CB94E;
                            outline: none;
                            color: #fff;
                            font-size: 14px;
                            height: auto;
                            font-weight: normal;
                            padding: 14px 0;
                            text-transform: uppercase;
                            border-color: #1CB94A;
                        }
                        .btn-register:hover,
                        .btn-register:focus {
                            color: #fff;
                            background-color: #1CA347;
                            border-color: #1CA347;
                        }
                    </style>
            </head>
            <body>
                <div class="container">
                    <div class="row">
                        <div class="col-md-6 col-md-offset-3">
                            <div class="panel panel-login">
                                <div class="panel-heading">
                                    <div class="row">
                                        <div class="col-xs-6">
                                            <a href="#" class="active" id="login-form-link">Conecte-se</a>
                                        </div>
                                        <div class="col-xs-6">
                                            <a href="#" id="register-form-link">Registre aqui</a>
                                        </div>
                                    </div>
                                    <hr>
                                </div>
                                <div class="panel-body">
                                    <div class="row">
                                        <div class="col-lg-12">
                                            <form id="login-form" action="" method="post" role="form" style="display: block;">
                                                <div class="form-group">
                                                    <input type="text" name="usuario" id="usuario" tabindex="1" class="form-control" placeholder="Usuario" value="">
                                                </div>
                                                <div class="form-group">
                                                    <input type="password" name="senha" id="senha" tabindex="2" class="form-control" placeholder="Senha">
                                                </div>
                                                <div class="form-group">
                                                    <div class="row">
                                                        <div class="col-sm-6 col-sm-offset-3">
                                                            <input type="submit" name="login-submit" id="login-submit" tabindex="4" class="form-control btn btn-login" value="Entrar">
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <div class="row">
                                                        <div class="col-lg-12">
                                                            <div class="text-center">
                                                                <a href="https://phpoll.com/recover" tabindex="5" class="forgot-password">Esqueci a senha</a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                            <form id="register-form" action="https://phpoll.com/register/process" method="post" role="form" style="display: none;">
                                                <div class="form-group">
                                                    <input type="text" name="usuario" id="usuario" tabindex="1" class="form-control" placeholder="Usuario" value="">
                                                </div>
                                                <div class="form-group">
                                                    <input type="email" name="email" id="email" tabindex="1" class="form-control" placeholder="Email Address" value="">
                                                </div>
                                                <div class="form-group">
                                                    <input type="password" name="senha" id="senha" tabindex="2" class="form-control" placeholder="Senha">
                                                </div>
                                                <div class="form-group">
                                                    <input type="confirmar-senha" name="confirmar-senha" id="confirmar-senha" tabindex="2" class="form-control" placeholder="Confirmar Senha">
                                                </div>
                                                <div class="form-group">
                                                    <div class="row">
                                                        <div class="col-sm-6 col-sm-offset-3">
                                                            <input type="Registrar Agora" name="Registrar Agora" id="Registrar Agora" tabindex="4" class="form-control btn btn-register" value="Registrar Agora">
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </body>
            <script src="//maxcdn.bootstrapcdn.com/bootstrap/3.3.0/js/bootstrap.min.js"></script>
            <script src="//code.jquery.com/jquery-1.11.1.min.js"></script>
        </html>
    `);
});

app.post("/login", (requisicao, resposta) =>{
    const usuario = requisicao.body.usuario;
    const senha = requisicao.body.senha;
    if(usuario == "admin" && senha == "123"){
        requisicao.session.logado = true;
        const dataHoraAtuais = new Date();
        resposta.cookie('ultimoLogin',dataHoraAtuais.toLocaleString(), {maxAge: 1000 * 60 * 60 * 24 * 30});
        resposta.redirect("/");
    }
    else{
    resposta.send(`
        <html lang="pt-br">
            <head>
                <meta charset="UFT-8">
                <link href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.0/css/bootstrap.min.css" rel="stylesheet" id="bootstrap-css">
                    <title>Login do Sistema</title>
                    <style>
                        body {
                            padding-top: 90px;
                        }
                        .panel-login {
                            border-color: #ccc;
                            -webkit-box-shadow: 0px 2px 3px 0px rgba(0,0,0,0.2);
                            -moz-box-shadow: 0px 2px 3px 0px rgba(0,0,0,0.2);
                            box-shadow: 0px 2px 3px 0px rgba(0,0,0,0.2);
                        }
                        .panel-login>.panel-heading {
                            color: #00415d;
                            background-color: #fff;
                            border-color: #fff;
                            text-align:center;
                        }
                        .panel-login>.panel-heading a{
                            text-decoration: none;
                            color: #666;
                            font-weight: bold;
                            font-size: 15px;
                            -webkit-transition: all 0.1s linear;
                            -moz-transition: all 0.1s linear;
                            transition: all 0.1s linear;
                        }
                        .panel-login>.panel-heading a.active{
                            color: #029f5b;
                            font-size: 18px;
                        }
                        .panel-login>.panel-heading hr{
                            margin-top: 10px;
                            margin-bottom: 0px;
                            clear: both;
                            border: 0;
                            height: 1px;
                            background-image: -webkit-linear-gradient(left,rgba(0, 0, 0, 0),rgba(0, 0, 0, 0.15),rgba(0, 0, 0, 0));
                            background-image: -moz-linear-gradient(left,rgba(0,0,0,0),rgba(0,0,0,0.15),rgba(0,0,0,0));
                            background-image: -ms-linear-gradient(left,rgba(0,0,0,0),rgba(0,0,0,0.15),rgba(0,0,0,0));
                            background-image: -o-linear-gradient(left,rgba(0,0,0,0),rgba(0,0,0,0.15),rgba(0,0,0,0));
                        }
                        .panel-login input[type="text"],.panel-login input[type="email"],.panel-login input[type="password"] {
                            height: 45px;
                            border: 1px solid #ddd;
                            font-size: 16px;
                            -webkit-transition: all 0.1s linear;
                            -moz-transition: all 0.1s linear;
                            transition: all 0.1s linear;
                        }
                        .panel-login input:hover,
                        .panel-login input:focus {
                            outline:none;
                            -webkit-box-shadow: none;
                            -moz-box-shadow: none;
                            box-shadow: none;
                            border-color: #ccc;
                        }
                        .btn-login {
                            background-color: #59B2E0;
                            outline: none;
                            color: #fff;
                            font-size: 14px;
                            height: auto;
                            font-weight: normal;
                            padding: 14px 0;
                            text-transform: uppercase;
                            border-color: #59B2E6;
                        }
                        .btn-login:hover,
                        .btn-login:focus {
                            color: #fff;
                            background-color: #53A3CD;
                            border-color: #53A3CD;
                        }
                        .forgot-password {
                            text-decoration: underline;
                            color: #888;
                        }
                        .forgot-password:hover,
                        .forgot-password:focus {
                            text-decoration: underline;
                            color: #666;
                        }

                        .btn-register {
                            background-color: #1CB94E;
                            outline: none;
                            color: #fff;
                            font-size: 14px;
                            height: auto;
                            font-weight: normal;
                            padding: 14px 0;
                            text-transform: uppercase;
                            border-color: #1CB94A;
                        }
                        .btn-register:hover,
                        .btn-register:focus {
                            color: #fff;
                            background-color: #1CA347;
                            border-color: #1CA347;
                        }
                    </style>
            </head>
            <body>
                <div class="container">
                    <div class="row">
                        <div class="col-md-6 col-md-offset-3">
                            <div class="panel panel-login">
                                <div class="panel-heading">
                                    <div class="row">
                                        <div class="col-xs-6">
                                            <a href="#" class="active" id="login-form-link">Conecte-se</a>
                                        </div>
                                        <div class="col-xs-6">
                                            <a href="#" id="register-form-link">Registre aqui</a>
                                        </div>
                                    </div>
                                    <hr>
                                </div>
                                <div class="panel-body">
                                    <div class="row">
                                        <div class="col-lg-12">
                                            <form id="login-form" action="/login" method="post" role="form" style="display: block;">
                                                <div class="form-group">
                                                    <input type="text" name="usuario" id="usuario" tabindex="1" class="form-control" placeholder="Usuario" value="">
                                                </div>
                                                <div class="form-group">
                                                    <input type="password" name="senha" id="senha" tabindex="2" class="form-control" placeholder="Senha">
                                                </div>
                                                <span style="color: red;">Usuario ou senha inválidos!</span>
                                                <div class="form-group">
                                                    <div class="row">
                                                        <div class="col-sm-6 col-sm-offset-3">
                                                            <input type="submit" name="login-submit" id="login-submit" tabindex="4" class="form-control btn btn-login">
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <div class="row">
                                                        <div class="col-lg-12">
                                                            <div class="text-center">
                                                                <a href="https://phpoll.com/recover" tabindex="5" class="forgot-password">Esqueci a senha</a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                            <form id="register-form" action="https://phpoll.com/register/process" method="post" role="form" style="display: none;">
                                                <div class="form-group">
                                                    <input type="text" name="usuario" id="usuario" tabindex="1" class="form-control" placeholder="Usuario" value="">
                                                </div>
                                                <div class="form-group">
                                                    <input type="email" name="email" id="email" tabindex="1" class="form-control" placeholder="Email Address" value="">
                                                </div>
                                                <div class="form-group">
                                                    <input type="senha" name="senha" id="senha" tabindex="2" class="form-control" placeholder="Senha">
                                                </div>
                                                <div class="form-group">
                                                    <input type="confirmar-senha" name="confirmar-senha" id="confirmar-senha" tabindex="2" class="form-control" placeholder="Confirmar Senha">
                                                </div>
                                                <div class="form-group">
                                                    <div class="row">
                                                        <div class="col-sm-6 col-sm-offset-3">
                                                            <input type="Registrar Agora" name="Registrar Agora" id="Registrar Agora" tabindex="4" class="form-control btn btn-register" value="Registrar Agora"
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </body>
            <script src="//maxcdn.bootstrapcdn.com/bootstrap/3.3.0/js/bootstrap.min.js"></script>
            <script src="//code.jquery.com/jquery-1.11.1.min.js"></script>
        </html>
    `);
    }
    //Realizar validação
});

function verificarAutenticacao(requisicao, resposta, next){
    if(requisicao.session.logado){
        next();
    }
    else{
        resposta.redirect("/login");
    }
}

app.get("/logout", (requisicao, resposta)=>{
    requisicao.session.destroy();
    resposta.redirect("/login");
});

app.listen(port, host, () => {
    console.log(`Servidor executando em http://${host}:${port}/`);
});