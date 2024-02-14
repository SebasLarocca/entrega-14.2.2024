import mongoose from "mongoose";

const ProductsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    photo: {
        type: String
    }
});

//acá define la colección (products) a la que apunta
export default mongoose.model("products", ProductsSchema)