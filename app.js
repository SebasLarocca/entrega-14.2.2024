import http from "http";
import express from "express";
import { engine } from "express-handlebars";
import config from "./config.js";
import compression from "express-compression";
import { Command } from "commander"; // librería para manejo de argumentos pasados por linea de comandos

//Chat imports
import { Server } from "socket.io";
import MessagesDAO from "./daos/mongo.dao/messages.dao.js";

//Mongo imports
import mongoose from "mongoose";
import MongoStore from "connect-mongo";

//Router imports
import prodsRouter from './routes/products.route.js'
import chatRouter from './routes/chat.route.js'
import cartRouter from './routes/cart.route.js'
import cookiesRouter from './routes/cookies.route.js'
import sessionsRouter from "./routes/sessions.route.js";
import viewsRouter from "./routes/views.route.js";
import ticketsRouter from "./routes/tickets.route.js";
import mockingRouter from './routes/mocking.route.js'
import passwordRecovery from './routes/passwordrecovery.js'

import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

//Auth imports
import session from "express-session";
import cookieParser from "cookie-parser";
import passport from 'passport'
import initializePassport from "./config/passport.config.js";

//para probar el logger
import {addProdLogger} from "./utils/logger/loggerProduction.js";

//para probar stress test o prueba de carga
import { operacionSencilla, operacionCompleja } from "./utils/stressTest.js";

// console.log((moment().subtract(1, 'hours').calendar()));

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);
httpServer.listen(config.port || 8081 , () => { console.log(`Server listening on port ${config.port}`) })

//Para toamr los comandos de consola. 
//Setea el mpetodo de persistencia
const program = new Command();
program.requiredOption('-persistance', 'modo de persistencia elegido: mongo o filesystem', 'mongo') //El metodo queda guardado en program.opts().Persistance. El default es mongo
program.parse(); //cierra la configuración de comandos.

//view engine
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views')
app.use(addProdLogger)
// console.log(addLogger);

//Middlewares request
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(compression({
    brotli: {enabled: true, zlib: {}}} //optimiza comprimiendo texto
))

// Public folder
app.use(express.static('public'))

//Cookies y session
app.use(cookieParser('sebaspass'));
app.use(session({
    store:MongoStore.create({
        mongoUrl:config.mongoURL,
        ttl:1000*60*60,
    }),
    secret:config.sessionSecret,
    resave:true,
    saveUninitialized:true
}))

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use("/cookies/", cookiesRouter)
//para probar el logger
app.use("/logger", (req,res)=>{
    req.logger.warning('Alerta!') //como el middleware ya le sumo la instancia logger a la req, la puedo usar aca
    res.send({message: 'Prueba de logger'})
})
//para probar el stress test o la prueba de carga
//operacion sencilla
app.use('/operacionsencilla', operacionSencilla)
//operacion compleja
app.use('/operacioncompleja', operacionCompleja)

app.use("/api/sessions", sessionsRouter);
app.use("/",  viewsRouter);
app.use('/cart/', cartRouter)
app.use('/products',prodsRouter)
app.get('/chat/', chatRouter)
app.use('/tickets/', ticketsRouter)
app.use('/mockingproducts/', mockingRouter);
app.use('/passrecovery/', passwordRecovery);


// app.get('/home', (req, res) => {
//     res.render('home')
// })

app.use((req, res, next) => {
    res.render('404')
})

//Lo de socket:
// Defino las reglas WS
// io.on('event', function(socket))
io.on('connection', (socket) => {
    console.log('A user connected');
    // socket.on('event', function)
    socket.on("disconnect", () => {
        console.log("A user disconnected");
    })
    socket.on("message", async (msg) => {
        await MessagesDAO.add(socket.id, msg)
        io.emit("message", msg);
    })
});

//conexión a mongo db
//acpa define: usuario (sebastianlarocca), pass (RockyBalboa27) y base de datos (ecommerce)
//en el schema se define la colección a la que apunta.
mongoose.connect(config.mongoURL)