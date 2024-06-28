import Users from "../../schemas/users.schema.js";

class UsersDAO {

    static async getUserByEmail(email){
        return await Users.findOne({email});
    }

    static async getUserByCreds(email, password) {
        return await Users.findOne({email, password});
    }

    static async insert(first_name, last_name, age, email, role="client", password ) {
        return await new Users({first_name, last_name, age, email, role, password }).save();
    }

    static async modifyField(email, data) {
        return await Users.updateOne({email: email}, data)
    }

    static async getUserByID(id) {
        return await Users.findOne({_id:id},{first_name:1, last_name:1, age:1, email:1, role:1}).lean();
    }
}

export default UsersDAO;
