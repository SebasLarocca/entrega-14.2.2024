import { Router } from "express";
import CartsDao from "../daos/mongo.dao/cart.dao.js";

const router = Router();

//Crea un carro
router.get('/cart', (req, res) => {
    CartsDao.createCart()
    res.send('ok')
})

//Borrar todos los productos
router.delete('/:cid', async (req, res)=>{
    const cartId = req.params.cid;
    console.log(cartId)
    const result = await CartsDao.removeProducts(cartId);
    res.send('productos borrados')
})

//Borrar 1 producto
router.delete('/:cid/products/:pid', async (req, res) => {
    let cartId = req.params.cid;
    let productId = req.params.pid
    const cart = await CartsDao.getCartById(cartId)
    let cartProds = cart[0].products
    let index;
    cartProds.forEach(element => {
        if (element.product.toString() == productId) {
            index = cartProds.indexOf(element)
        } else {
            console.log('no es')
        }
    });
    cartProds.splice(index, 1)

    res.send(cart.products)
})

//devuelve todos los carros con el populate
router.get('/carts', async (req, res) => {
    let carts = await CartsDao.getCarts()
    console.log(JSON.stringify(carts, null, '\t'));
    res.send(carts)
})

//Agrega un producto al caro si no está ya incluido, o modifica su cantidad en caso que ya exista
router.put('/:cid/products/:pid', (req, res)=>{
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity
    CartsDao.addProduct(cartId, productId, quantity)
    res.send('Producto agregado')
})
export default router;