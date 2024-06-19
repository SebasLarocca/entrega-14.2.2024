import { Router } from "express";
import TicketsDAO from "../daos/mongo.dao/tickets.dao.js";
import authenticate from "../middlewares/authentication.js";
import CartsDao from "../daos/mongo.dao/cart.dao.js";

const router = Router();

router.get('/addticket', async (req, res)=>{
    let userID = req.user
    let cart = await CartsDao.getCartByUser(userID)
    let purchasedProducts = cart[0].products;
    let ticket = await TicketsDAO.addTicket(2000, 'mongo@mongo.com', purchasedProducts )
    res.send('oka')
})

router.get('/getticket/:id', async (req,res)=>{
    let id = req.params.id
    let ticket = await TicketsDAO.getTicketById(id)
    res.send(ticket)
})
export default router;

