//Chat imports
import { Server } from "socket.io";
import chatRouter from './routes/chat.route.js'
const io = new Server(httpServer);

//view engine
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views')

//Router
app.get('/chat/', chatRouter)

// Defino las reglas WS
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
