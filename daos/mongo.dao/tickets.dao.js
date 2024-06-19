import Tickets from '../../schemas/ticket.schema.js';
import { v4 as uuidv4 } from 'uuid';
import CartsDao from './cart.dao.js';

class TicketsDAO {
    static async addTicket(amount, purchaser, products) {
        let code = uuidv4();
        let newTicket = await new Tickets({ code, amount, purchaser }).save();
        let newTicketProducts = await Tickets.updateOne(
            { _id: newTicket._id.toString() },
            { $addToSet: { products: { $each: products } } })
        return newTicket
    }

    static async getTicketById(id) {
        return Tickets.findOne({ _id: id }).lean()
    }
}

export default TicketsDAO;