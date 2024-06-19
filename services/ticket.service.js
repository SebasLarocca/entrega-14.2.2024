import CartsDao from "../daos/mongo.dao/cart.dao.js";
import TicketsDAO from "../daos/mongo.dao/tickets.dao.js";


const purchaseTicket = async (userId, userMail, amount, purchasedProducts, noStockProducts) => {
    let cart = await CartsDao.getCartByUser(userId)
    let ticket = await TicketsDAO.addTicket(amount, userMail, purchasedProducts)
    let emptyCart = await CartsDao.removeProducts(cart[0]._id.toString())
    console.log('carrito sin productos');
    console.log(emptyCart);
    let noPurchasedProdsCart = await CartsDao.addNoPurchasedProducts(cart[0]._id.toString(), noStockProducts )
    console.log('carrito con prods no comprados');
    console.log(noPurchasedProdsCart);
}

export default purchaseTicket