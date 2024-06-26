import { expect } from "chai";
import mongoose from "mongoose";
import config from "../config.js";
import ProductsDAO from "../daos/mongo.dao/products.dao.js";

mongoose.connect(config.mongoMockURL)

describe('Prueba de products DAO', () => {
    
    it('Crea nuevo producto', async () => {
        const result =  await ProductsDAO.getAll(1,5, null)
        console.log(result);
        expect(result).to.be.not.empty
    })
})