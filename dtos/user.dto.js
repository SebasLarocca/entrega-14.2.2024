import UsersDAO from "../daos/mongo.dao/users.dao.js";

export const getUserByID = async (id)=>{
const {first_name, last_name, role } = await UsersDAO.getUserByID(id)
return {first_name, last_name, role}    
}