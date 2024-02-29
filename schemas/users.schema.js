import mongoose from "mongoose";

const UsersSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    isAdmin:
         {
            type: Boolean,
            default: false
        },
    password:{
        type:String,
        required: true
    }
});

export default mongoose.model("users", UsersSchema);