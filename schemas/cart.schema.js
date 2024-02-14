import mongoose from "mongoose";
//firma del cart
//[{"products":[{"product":"4","quantity":4}],"id":0}]
const CartsSchema = new mongoose.Schema(
    {
        products: [{
            product: String,
            quantity: Number}
        ]
    }
);

//acá define la colección (messages) a la que apunta
export default mongoose.model("messages", MessagesSchema)
