import cartModel from "../../schemas/cart.schema.js";

class CartsDao {

    static async createCart() {
        cartModel.create({
        })
    }

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

    static async removeProducts(cartId) {
        return cartModel.updateOne({ _id: cartId }, { $set: { "products": [] } });
    }

    static async removeOneProduct(cartId, newCart) {
        return cartModel.updateOne({ _id: cartId }, newCart );
    }
    static async getCarts() {
        return cartModel.find().lean().populate('products.product');
    }

    static async getCartById(id) {
        return cartModel.find({ _id: id })
    }

}

export default CartsDao;