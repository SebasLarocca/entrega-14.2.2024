import { Router } from "express";
import CartsDao from "../daos/mongo.dao/cart.dao.js";

const router = Router();

router.get('/cart', (req, res) => {
    CartsDao.createCart()
    res.send('ok')
})


router.delete('/:cid', async (req, res)=>{
    const cartId = req.params.cid;
    console.log(cartId)
    const result = await CartsDao.removeProducts(cartId);
    res.send('productos borrados')
})

//Borrar 1 producto

// router.delete('/:cid/products/:pid', async (req, res) => {
//     let cartId = req.params.cid;
//     let productId = req.params.pid
//     const cart = await CartsDao.getCartById(cartId)
//     let cartProds = cart[0].products
//     console.log(cartProds.length)
//     let index;
//     cartProds.forEach(element => {
//         if (element.product.toString() == productId) {
//             index = cartProds.indexOf(element)
//         } else {
//             console.log('no es')
//         }
//     });
//     cartProds.splice(index, 1)
//     res.send(cart.products)
// })

router.get('/carts', async (req, res) => {
    let carts = await CartsDao.getCarts()
    console.log(JSON.stringify(carts, null, '\t'));
    res.send(carts[0].products)
})


router.put('/:cid/products/:pid', (req, res)=>{
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity
    CartsDao.addProduct(cartId, productId, quantity)
    res.send('Prodcuto agregado')
})
export default router;