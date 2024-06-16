import { Router } from "express";
import CartsDao from "../daos/mongo.dao/cart.dao.js";
import ProductsDAO from "../daos/mongo.dao/products.dao.js";
import authenticate from "../middlewares/authentication.js";

const router = Router();

router.get('/pruebacreacart', authenticate, (req, res) => {
    res.render('createCartTest')
})

//Crea un carro
router.get('/cart',
    authenticate,
    (req, res) => {
        let user = req.session.user
        CartsDao.createCart(user)
        res.send('ok')
    })



//Borrar todos los productos
router.delete('/:cid', authenticate, async (req, res) => {
    const cartId = req.params.cid;
    console.log(cartId)
    const result = await CartsDao.removeProducts(cartId);
    res.redirect('/products')
})


//Borrar 1 producto
router.delete('/:cid/products/:pid', authenticate, async (req, res) => {
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
    const newCart = { $set: { "products": cart[0].products } }
    const newCartArray = CartsDao.removeOneProduct(cartId, newCart)
    res.send('Producto borrado')
})

//devuelve todos los carros con el populate
router.get('/carts', authenticate, async (req, res) => {
    let carts = await CartsDao.getCarts()
    console.log(JSON.stringify(carts, null, '\t'));
    res.send(carts)
})

//Agrega un producto al caro si no está ya incluido, o modifica su cantidad en caso que ya exista
router.post('/:cid/products/:pid', authenticate, (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    let quantity = req.body.quantity
    !quantity ? quantity = 1 : null
    CartsDao.addProduct(cartId, productId, quantity)
    res.redirect('/products')
})

//Muestra los carritos
router.get('/cartslist', authenticate, async (req, res) => {
    const carts = await CartsDao.getCarts()
    res.render('carts', { carts })
})

//Muestra el detalle de 1 carrito
router.get('/usercart', authenticate, async (req, res) => {
    let user = req.session.user
    let cart = await CartsDao.getCartByUser(user)
    cart = cart[0]
    console.log(user);
    res.render('cartdetail', { cart, user })
})

router.get('/:cid/purchase', async (req, res) => {
    let cartID = req.params.cid;
    let cart = await CartsDao.getCartById(cartID)
    let cartProducts = cart[0].products
    let purchase = []
    let noStockProducts = []
    cartProducts.forEach(element => {
        (element.product.stock < element.quantity) ? noStockProducts.push(element) : purchase.push(element)
    });
    console.log('Lo comprado');
    console.log(purchase);
    console.log('Lo excluido');
    console.log(noStockProducts);
    res.redirect('/')
})

export default router;