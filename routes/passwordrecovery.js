
import { createHash } from '../utils/utils.js';
import UsersDAO from '../daos/mongo.dao/users.dao.js';
import moment from 'moment';
import { Router } from 'express';
import { sendMail } from '../services/nodemailer.js';
import bcrypt from 'bcrypt'

const router = Router()

//Routers
//sebita: pass de sebastian_larocca@hotmail.com

router.get('/newpasswordform', (req,res)=>{
    res.render('newpasswordform')
})

router.post('/linkDesdeBotonRecupero', async (req, res) => {
    const userMail = req.body.email
    const userExists = await UsersDAO.getUserByEmail(userMail)
    if (!userExists) {
        res.redirect('/register')
    } else {
        await sendMail(userMail)
        res.redirect('mailsent')
    }
})

router.get('/mailsent', (req, res) => {
    res.render('mailenviado')
})

//Hasta aca el flujo que envia el mail
// -----------------------------------------------------------------------
//Ahora comienza el flujo una vez que le da click al boton dentro del mail

router.get('/botonDesdeMail/:userMail/:sentDate', (req, res) => {
    const userMail = req.params.userMail
    const sentDate = moment(new Date(req.params.sentDate))
    const actualDate = moment()
    console.log(userMail);
    console.log(sentDate);
    console.log(actualDate);
    const diffInMinutes = actualDate.diff(sentDate, 'minutes')
    console.log(diffInMinutes);
    //setea el tiempo en que esta disponible el recupero de pass en 60 minutos
    if(diffInMinutes > 60){
        res.send('tiempo vencido')
    } else {
        res.render('cambiodepass', {userMail}) // esta vista es el formulario donde ingresamos el nuevo pass
    }



    //confirma que el boton se toco a menos de 1 hora de enviado el mail
    //vista de ingresa nuevo pass
    //Boton que envia nueva pass (apunta a un post a mongo)
    // Redirige a login
})

// pepito
router.post('/formnuevopass/:userMail', async (req, res) => { //recibe por body el mail, y tiene un input para el nuevo pass
    const newPass = req.body.newPass
    const hashedPass = createHash(newPass)
    const userMail = req.params.userMail
    const user = await UsersDAO.getUserByEmail(userMail)
    console.log(userMail);
    console.log(newPass);
    console.log(user.password);
    console.log(createHash(newPass));
    const isOldPassword = bcrypt.compareSync(newPass, user.password) 
    if (!isOldPassword) {
        console.log('Entro en pass válida');
        const changePass = await UsersDAO.modifyField(userMail, {password: hashedPass})
        console.log(changePass);
        res.redirect('/login')
    } else {
        console.log('Entro en old pass');
        res.send('Inrgesaste la misma contraseña de antes')
    }
        
    //recibe pass y usuario desde el body
    //Actualiza mongo
    //redirige a login
})









export default router