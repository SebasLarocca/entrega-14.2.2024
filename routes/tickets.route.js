import { Router } from "express";
import TicketsDAO from "../daos/mongo.dao/tickets.dao.js";
import authenticate from "../middlewares/authentication.js";

const router = Router();

router.post('/addticket', async (req, res)=>{
    let ticket = await TicketsDAO.addTicket(2000, 'mongo@mongo.com' )
    res.send(ticket)
})

router.get('/getticket/:id', async (req,res)=>{
    let id = req.params.id
    let ticket = await TicketsDAO.getTicketById(id)
    res.send(ticket)
})
export default router;
