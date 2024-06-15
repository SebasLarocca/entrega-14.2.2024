import mongoose from "mongoose";

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
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }
}

);

//acá define la colección (carts) a la que apunta
const cartModel = mongoose.model('carts', CartsSchema)
export default cartModel;