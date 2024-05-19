
import http from "http";
import express from "express";
import { engine } from "express-handlebars";
import config from "./config.js";

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

import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

//Auth imports
import session from "express-session";
import cookieParser from "cookie-parser";
import passport from 'passport'
import initializePassport from "./config/passport.config.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);

httpServer.listen(config.port, () => { console.log(`Server listening on port ${config.port}`) })

//view engine
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views')

//Middlewares request
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

// Public folder
app.use(express.static('public'))

//Cookies y session
app.use(cookieParser('sebaspass'));
app.use(session({
    store:MongoStore.create({
        mongoUrl:config.mongoURL,
        ttl:15,
    }),
    secret:config.sessionSecret,
    resave:true,
    saveUninitialized:true
}))

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use("/cookies/", cookiesRouter)
app.use("/api/sessions", sessionsRouter);
app.use("/", viewsRouter);
app.use('/cart/', cartRouter)
app.use('/products', prodsRouter)
app.get('/chat/', chatRouter)

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