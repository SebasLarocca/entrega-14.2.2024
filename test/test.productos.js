import { expect } from "chai";
import supertest from "supertest";
import mongoose from "mongoose";
import config from "../config.js";

mongoose.connect(config.mongoMockURL)
const requester = supertest('http://localhost:8081')

describe('Prueba de products router', () => {
    
    it('Crea nuevo producto', async () => {
        const mockProduct = {
            title: 'Un producto',
            description: 'Descripcion de un producto',
            stock: 10,
            price: 1000,
        }
        const result = await requester.post('/products')
            .field('title', mockProduct.title)
            .field('description', mockProduct.description)
            .field('stock', mockProduct.stock)
            .field('price', mockProduct.price)
            .attach('photo', './public/images/products/1707764577949-25716025.png')
        expect(result.status).to.be.eql(200)
    })

    it('Trae los productos', async ()=>{
        const result = await requester.post('/products')
        console.log(result.res._body);
        expect(result.statusCode).to.be.eql(200)
    })

    // it('')
})