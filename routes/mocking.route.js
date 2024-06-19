import { fakerTest } from "../utils/moking.js";
import { Router } from "express";

const router = Router();

router.get('/mockingproducts', (req, res)=>{
    const products = fakerTest()
    res.send(products)
})

export default router;