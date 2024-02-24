import mongoose from "mongoose";
//firma del cart
//[{"products":[{"product":"4","quantity":4}],"id":0}]
const CartsSchema = new mongoose.Schema({
    products: {
        type: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'products'
                },
                quantity: {
                    type: Number
                }
            }
        ],
        default: []
    }
}

);

//acá define la colección (carts) a la que apunta
const cartModel = mongoose.model('carts', CartsSchema)
export default cartModel;