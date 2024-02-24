import http from "http";
import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import mongoose from "mongoose";
import prodsRouter from './routes/products.route.js'
import chatRouter from './routes/chat.route.js'
import cartRouter from './routes/cart.route.js'
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import MessagesDAO from "./daos/mongo.dao/messages.dao.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);

httpServer.listen(8080, () => { console.log('Server listening on port 8080') })

//view engine
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views')

//Middlewares request
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

// Public folder
app.use(express.static('public'))

app.get("/", (req, res) => {
    res.redirect('/products')
})

app.get('/cart/', cartRouter)
app.use('/products', prodsRouter)
app.get('/chat/', chatRouter)

app.get('/home', (req, res) => {
    res.render('home')
})

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
mongoose.connect('mongodb+srv://sebastianlarocca:RockyBalboa27@cluster0.xbrgkcu.mongodb.net/ecommerce?retryWrites=true&w=majority')