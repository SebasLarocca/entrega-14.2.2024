import { Router } from "express";
const router = Router();

router.get('/setcookie', (req, res)=>{
    res.cookie('primeraCookie', 'Esta es la primera cookie modificada', {maxAge: 100000, signed:true}).send('Cookie')
})

router.get('/getcookie', (req, res)=>{
    res.send(req.signedCookies.primeraCookie)
})

router.get('/deletecookie', (req, res)=>{
    res.clearCookie('primeraCookie').send('Cookie eliminada')
})


export default router