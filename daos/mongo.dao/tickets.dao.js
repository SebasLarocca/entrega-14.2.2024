import Tickets from '../../schemas/ticket.schema.js';
import { v4 as uuidv4 } from 'uuid';

class TicketsDAO {
    static async addTicket(amount, purchaser) {
        let code = uuidv4();
        return new Tickets({ code, amount, purchaser }).save();
    }

    static async getTicketById(id) {
        return Tickets.findOne({ _id: id }).lean()
    }
}

export default TicketsDAO;