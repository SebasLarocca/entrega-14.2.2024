import { Router } from "express";
import CartsDao from "../daos/mongo.dao/cart.dao.js";

const router = Router();

router.get('/', (req, res) => {
    res.send('Hola')
})

router.get('/cart', (req, res) => {
    CartsDao.createCart()
    res.send('ok')
})

// cart: 65d7d4540b75523bd4d3c35d
// product: 65cb6cdf5de29649f76b9cb8
router.delete('/:cid/products/:pid', async (req, res) => {
    let cartId = req.params.cid;
    let productId = req.params.pid
    const cart = await CartsDao.getCartById(cartId)
    let cartProds = cart[0].products
    console.log(cartProds.length)
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

router.get('/carts', async (req, res) => {
    let carts = await CartsDao.getCarts()
    console.log(JSON.stringify(carts, null, '\t'));
    res.send(carts[0].products)
})

router.get('/cartaddprod', (req, res) => {
    CartsDao.addProduct('65d53391618c613739db69a1')
    res.send('agregado')
})
export default router;