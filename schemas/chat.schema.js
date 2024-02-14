import mongoose from "mongoose";

const MessagesSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }  
});

//acá define la colección (messages) a la que apunta
export default mongoose.model("messages", MessagesSchema)
