import Router from "express";
import { createHash } from "../utils/utils.js";
import UsersDAO from "../daos/mongo.dao/users.dao.js";
import { isValidPassword } from "../utils/utils.js";
import Users from '../schemas/users.schema.js'
import passport from 'passport'

const router = Router()

//Setea un counter por cada vez que se ingresa al sitio con la misma sesion
router.get('/session', (req,res)=>{
    if(req.session.counter){
        req.session.counter++;
        res.send(`Se ha visitado el sitio ${req.session.counter} veces`)
    } else {
        req.session.counter = 1;
        res.send('Bienvenido!')
    }
})

//borra los datos de sesion
router.get('/sessionlogout', (req, res)=>{
    req.session.destroy( err => {
        if(!err) res.send('Logout ok')
        else res.send({status: 'Logout Error', body: err})
    })
})

router.get('/github', passport.authenticate('github', {scope:['user:email']}), async(req,res)=>{})
router.get('/githubcallback', passport.authenticate('github', {failureRedirect:'/login'}), async (req,res)=>{
    req.session.user = req.user;
    res.redirect('/')
})

//Registro con passport local
router.post('/register', passport.authenticate('register', {failureRedirect:'/failregister'}), async (req,res)=>{
    res.send({status: 'success', message:'User registered'})
})

router.get('/failregister', async (req, res)=>{
    console.log('Failed strategy');
    res.send({error: 'failed'})
})

//Esto es el registro sin passport
// router.post("/register", async (req, res) => {

//     let first_name = req.body.first_name;
//     let last_name = req.body.last_name;
//     let email = req.body.email;
//     let age = parseInt(req.body.age);
//     let password = createHash(req.body.password);
    
//     if (!first_name || !last_name || !email || !age || !password) {
//         res.redirect("/register");
//     }
    
//     let emailUsed = await UsersDAO.getUserByEmail(email);
//     if (emailUsed) {
//         res.redirect("/register");
//     } else {
//         await UsersDAO.insert(first_name, last_name, age, email, password);
//         res.redirect("/login");
//     }
// })

//Login con passport local:
router.post('/login', passport.authenticate('login', {failureRedirect: '/api/sessions/faillogin'}), async (req,res)=>{
    if(!req.user) return res.status(400).send({status: 'error', error: 'Invalid credentials'});
    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email
    }
    res.send({status: 'success', payload: req.user})
})

//monchi es de ricardo

router.get('/faillogin', (req, res)=>{
    res.send({error: 'Failed login'})
})

// //Esto es login sin passport:
// router.post("/login", async (req, res) => {

//     let email = req.body.email;
//     let password = req.body.password;

//     const user = await Users.findOne({ email: email }, { email: 1, first_name: 1, last_name: 1, password: 1 })
//     if (isValidPassword(user, password)) {
//         req.session.user = user._id;
//         res.redirect(`/products/?user=${req.session.user}`)
//     } else {
//         res.redirect('/login')
//     }
// })

router.get("/borrarusuarios", async (req, res) => {
    const usuarios = await UsersDAO.createAdmin()
    res.send(usuarios)
})

router.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        res.redirect("/home");
    })
})

export default router;