import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const productsSchema = new mongoose.Schema({
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
    }, 
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
});

productsSchema.plugin(mongoosePaginate);
//acá define la colección (products) a la que apunta
export default mongoose.model("products", productsSchema)   

