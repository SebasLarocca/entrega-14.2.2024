import nodemailer from 'nodemailer';
import config from '../config.js';
import moment from 'moment';

//Configuración de nodemailer
export const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        // user: config.gmailUser,
        user: 'sebastian.larocca@gmail.com',
        // pass: config.gmailCode
        pass: 'cphp nvsb frpi znde'
    }
})

//Manda mail
export const sendMail = async (mail) => {
    const sentDate = moment()
    let result = await transport.sendMail({
        from: 'Prueba de sebas <sebastian.larocca@gmail.com>',
        to: 'sebastian.larocca@gmail.com',
        subject: 'Ecommerce password recovery',
        //el link debe tener el dominio de producción cuando lo deploye
        html: `<div><button><a href="https://entrega-1422024-production.up.railway.app/passrecovery/botonDesdeMail/${mail}/${sentDate}">Click para restaurar tu pass</a></button></div>`,
    })
}