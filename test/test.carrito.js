import {expect} from "chai";
import supertest from "supertest";
import mongoose from "mongoose";
import config from "../config.js";

mongoose.connect(config.mongoMockURL)
const requester = supertest('http://localhost:8081')

describe('test 1', async ()=>{
        it('test 1.1', ()=>{
            
        })
})
describe('test 1', async ()=>{

})
describe('test 1', async ()=>{

})