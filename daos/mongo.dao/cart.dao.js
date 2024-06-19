import cartModel from "../../schemas/cart.schema.js";

class CartsDao {

    //Crea carrito
    static async createCart(user) {
        let cart = cartModel.create({
            user: user
        })

        return cart
    }

    // Chequeo si un carrito existe o no por usuario
    static async cartExists(user) {
        let exists = cartModel.exists({user: user})
        return exists
    }
    
    //Agrega producto a carrito
    static async addProduct(cartId, productId, cantidad) {
        const cart = await cartModel.find({ _id: cartId })
        let exists = false
        cart[0].products.forEach(element => {
            element.product.toString() == productId ? exists = true : null
        });
        console.log(exists)

        if (!exists) {
            //Si el producto no existe en el carrito
            let result = await cartModel.updateOne(
                { _id: cartId },
                { $addToSet: { products: { product: productId, quantity: cantidad } } }
            )
            console.log('Producto agregado')
        } else {
            // Si el producto existe en el carrito
            const query = { "products.product": { $eq: `${productId}` }, "_id": `${cartId}` };
            const updateDocument = {
                $inc: { "products.$.quantity": cantidad }
            };
            const result1 = await cartModel.updateOne(query, updateDocument);
            console.log('Cantidad agregada')
        }
    }

    //Vacia array de carrito
    static async removeProducts(cartId) {
        return cartModel.updateOne({ _id: cartId }, { $set: { "products": [] } });
    }

    //Llena array con productos (para cuando debe ser completado con los que no se pudieron comprar)

    static async addNoPurchasedProducts(cartId, noStockProducts) {
        let newTicketProducts = await cartModel.updateOne(
            { _id: cartId },
            { $set: { products: noStockProducts } })
    }

    //Borra 1 producto de un carrito
    static async removeOneProduct(cartId, newCart) {
        return cartModel.updateOne({ _id: cartId }, newCart);
    }

    static async getUserCart(user) {
        return cartModel.find({user: user})
    }
    //Trae todos los carritos
    static async getCarts() {
        return cartModel.find().lean().populate('products.product');
    }

    //Trae un carrito por ID
    static async getCartById(id) {
        return cartModel.find({ _id: id }).lean().populate('products.product');
    }

    //Trae un carrito por usuario 
    static async getCartByUser(userID) {
        return cartModel.find({user: userID}).lean().populate('products.product');
    }

}

export default CartsDao;