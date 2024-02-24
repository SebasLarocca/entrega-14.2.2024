import cartModel from "../../schemas/cart.schema.js";

class CartsDao {

    static async createCart() {
        cartModel.create({
        })
    }

    static async getCarts() {
        return cartModel.find().lean().populate('products.product');
    }

    static async addProduct(id) {
        let cart = await cartModel.find({_id:'65d7d4540b75523bd4d3c35d'});
        let exist = false
        cart[0].products.forEach((product =>{ if (id === product._id ) {
            exist = true
        } }))
        if (!exist){
        cart[0].products.push({product: id, quantity: (quantity + 1)});
        console.log(cart[0].products)
        let cartToAdd = cart[0]
        let result = await cartModel.updateOne({_id: '65d7d4540b75523bd4d3c35d'}, cartToAdd)
        } else {

        }
        
    }

    
}

export default CartsDao;