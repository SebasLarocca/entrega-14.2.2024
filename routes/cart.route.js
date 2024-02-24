import { Router } from "express";
import CartsDao from "../daos/mongo.dao/cart.dao.js";


const router = Router();

router.get('/', (req, res)=>{
    res.send('Hola')
})

export default router;