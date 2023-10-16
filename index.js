const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const bcrypt = require('bcrypt')

const conn = require('./db/conn')
const Usuario = require('./models/Usuario')

const PORT = 3000
const hostname = 'localhost'

let log = false

//---------------express config-------------
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static('public'))
//----------config handlebars---------------
app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')
//------------------------------------------

app.get('/cadastro', (req,res)=>{
    res.render('cadastro', {log})
})


app.get('/logout', (req,res)=>{
    log = false
    res.render('home', {log})
})

app.post('/login', async (req,res)=>{
    const email = req.body.email
    const senha = req.body.senha
    const pesq = await Cliente.findOne({raw: true, where:{email:email}})
    console.log(pesq)
    if(pesq == null){
        console.log('Usuário não encontrado')        
        res.status(200).redirect('/')
    }else if(pesq.email == email){
        console.log('Usuário encontrado')
        log = true
        res.render('home', {log})
    }else{
        console.log('Usuário não encontrado') 
        res.status(200).redirect('/')  
    }
})


app.get('/login', (req,res)=>{
    res.render('login', {log})
})

app.get('/', (req,res)=>{
    res.render('home', {log})
})

app.post('/cadastro', async (req, res) => {
    const nome = req.body.nome
    const email = req.body.email
    const telefone = req.body.telefone
    const senha = req.body.senha

    console.log(nome, email, telefone, senha)

    bcrypt.hash(senha, 10, async (err, hash) => {
        if (err) {
            console.error('erro ao criar o hash da senha' + err)
            res.render('home', { log })
            return
        }
        try {
            await Usuario.create({ nome: nome, email: email, telefone: telefone, senha: hash })
            console.log('/n')
            console.log('Senha criptografada')
            console.log('/n')

            log = true

            const pesq = await Usuario.findOne({ raw: true, where: { nome: nome, senha: hash } })
            console.log(pesq)
            res.render('home', { log })
        } catch (error) {
            console.error('Erro ao criar a senha' + error)
            res.render('home', { log })
        }
    })
})

app.get('/cadastro', (req, res) => {
    res.render('cadastro', { log })
})

app.get('/', (req, res) => {
    res.render('home', { log })
})

//------------------------------------------
conn.sync().then(() => {
    app.listen(PORT, hostname, () => {
        console.log(`Servidor rodando ${hostname}:${PORT}`)
    })
}).catch((error) => {
    console.error(`Falha de conexão com Banco de Dados` + error)
})
