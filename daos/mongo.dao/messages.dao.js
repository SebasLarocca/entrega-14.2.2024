import Messages from '../../schemas/chat.schema.js';

class MessagesDAO {

    static async add(user, message) {
        return new Messages({user, message}).save();
    }
}

export default MessagesDAO;