import Router from "express";
import { createHash } from "../utils/utils.js";
import UsersDAO from "../daos/mongo.dao/users.dao.js";
import { isValidPassword } from "../utils/utils.js";
import Users from '../schemas/users.schema.js'
import passport from 'passport'

const router = Router()

//borra los datos de sesion
router.get('/sessionlogout', (req, res)=>{
    req.session.destroy( err => {
        if(!err) res.send('Logout ok')
        else res.send({status: 'Logout Error', body: err})
    })
})

//Autenticación con github
router.get('/github', passport.authenticate('github', {scope:['user:email']}), async(req,res)=>{})

router.get('/githubcallback', passport.authenticate('github', {failureRedirect:'/login'}), async (req,res)=>{
    req.session.user = req.user;
    res.redirect('/products')
}) 

//Registro con passport local
router.post('/register', passport.authenticate('register', {failureRedirect:'/api/sessions/failregister'}), async (req,res)=>{
    res.send({status: 'success', message:'User registered'})
})

router.get('/failregister', async (req, res)=>{
    console.log('Failed strategy');
    res.send({error: 'failed: user already exists'})
})


//Login con passport local:
router.post('/login', passport.authenticate('login', {failureRedirect: '/api/sessions/faillogin'}), async (req,res)=>{
    if(!req.user) return res.status(400).send({status: 'error', error: 'Invalid credentials'});
    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email
    }
    req.session.user = req.user;
    res.redirect('/products')
})

router.get('/faillogin', (req, res)=>{
    res.send({error: 'Failed login'})
})

router.get("/borrarusuarios", async (req, res) => {
    const usuarios = await UsersDAO.createAdmin()
    res.send(usuarios)
})

router.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        res.redirect("/");
    })
})

router.post("/adminRegister", (req, res) => {
    const {first_name, last_name, age, email, role, password} = req.body;
    UsersDAO.insert(first_name, last_name, age, email, role, password);
    res.status(200).send('Usuario agregado correctamente')
})

export default router;