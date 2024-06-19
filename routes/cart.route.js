import { Router } from "express";
import CartsDao from "../daos/mongo.dao/cart.dao.js";
import ProductsDAO from "../daos/mongo.dao/products.dao.js";
import authenticate from "../middlewares/authentication.js";
import purchaseTicket from "../services/ticket.service.js";
import UsersDAO from "../daos/mongo.dao/users.dao.js";

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
    res.render('cartdetail', { cart, user })
})

//endpoint previa para confirmación de la compra
//muestra de qué productos hay stock y de cuales no
//Aqui aun no hay confirmacion de la compra por lo cual aun no se descuenta del stock

router.get('/:cid/purchase', async (req, res) => {
    let cartID = req.params.cid;
    let cart = await CartsDao.getCartById(cartID)
    let cartProducts = cart[0].products
    let purchase = []
    let noStockProducts = []
    let totalAmmount = 0;
    cartProducts.forEach(element => {
        (element.product.stock < element.quantity) ? noStockProducts.push(element) : purchase.push(element)
    });
    purchase.forEach(element => {
        let productAmount = element.quantity * element.product.price
        totalAmmount += productAmount
    })
    res.render('purchaseconfirmation', { cartID, totalAmmount, noStockProducts, purchase })
});

//endpoint de confirmación de la compra
//muestra de qué productos hay stock y de cuales no
//Aqui  hay confirmacion de la compra por lo cual se descuenta del stock

router.get('/:cid/purchaseconfirmation', async (req, res) => {
    let userID = req.user
    let cartID = req.params.cid;
    let cart = await CartsDao.getCartById(cartID)
    let user = await UsersDAO.getUserByID(userID)
    let userMail = user.email
    let cartProducts = cart[0].products
    let purchase = []
    let noStockProducts = []
    let totalAmmount = 0;
    cartProducts.forEach(element => {
        (element.product.stock < element.quantity) ? noStockProducts.push(element) : purchase.push(element)
    });
    purchase.forEach(async element => {
        let productAmount = element.quantity * element.product.price
        totalAmmount += productAmount
        let prodID = element.product._id.toString();
        let modifiedProduct = await ProductsDAO.update(prodID, { $inc: { stock: -element.quantity } })
    })
    purchaseTicket(userID, userMail, totalAmmount, purchase, noStockProducts)
    res.redirect('/products')
    //acá se puede hacer un res.send({noStockProducts}) y devuelve el array con los productos no incluidos en la compra
})

export default router;