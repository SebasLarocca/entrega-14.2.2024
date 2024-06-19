import mongoose from "mongoose";

const ticketsSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
    },
    purchaser: {
        type: String
    },
    products: {
        type: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'products'
                }
            }
        ],
        default: []
    },
},
    { timestamps: true }
);

//acá define la colección (products) a la que apunta
export default mongoose.model("tickets", ticketsSchema)   
