import { Router } from "express";
import upload from "../utils/upload.middleware.js";
import ProductsDAO from "../daos/mongo.dao/products.dao.js"

const router = Router();


router.get('/', async (req, res) => {
    let withStock = req.query.stock;
    let ascending = req.query.ascending
    let descending = req.query.descending
    let products;
    if (withStock != undefined) {
        products = await ProductsDAO.getAllWithStock()
    } else if (ascending != undefined) {
        products = await ProductsDAO.getAllAscending()
    } else if (descending != undefined) {
        products = await ProductsDAO.getAllDescending()
    } else {
        products = await ProductsDAO.getAll();
    }
    res.render('products', { products })
})

router.get("/new", (req, res) => {
    res.render('new-product')
})

router.get("/admin", async (req, res) => {
    let products = await ProductsDAO.getAll();
    res.render("adminManagement", { products })
})
router.get('/:id', async (req, res) => {
    let id = req.params.id;
    if (!id) {
        res.redirect('/products')
    }
    let product = await ProductsDAO.getById(id)
    if (!product) {
        res.render('404')
    }

    res.render('product', {
        title: product.title,
        description: product.description,
        photo: product.photo,
        price: product.price,
        isStock: product.stock > 0
    })

})


router.post('/', upload.single('image'), async (req, res) => {
    let filename = req.file.filename;
    let product = req.body
    await ProductsDAO.add(product.title, product.description, filename, product.price, product.stock);
    res.redirect('/products');
})


router.post('/update/:id', async (req, res) => {
    let data = req.body
    let id = req.params.id
    await ProductsDAO.update({ _id: id }, data);
    res.status(200).send('update ok');
})



// //actualzizar valores de un producto
// router.post('/update/:id', async (req, res)=>{
//     let id = req.params.id;
//     let data = req.body
//     await ProductsDAO.update({_id: id}, data)
//     res.status(200).send('Update ok')
// })

//Borrar un producto
router.post('/:id', async (req, res) => {
    let productToDelete = req.params.id;
    await ProductsDAO.remove(productToDelete);
    res.status(201).redirect("/products")
})




router.post('/update/:id', (req, res) => {
    let data = req.body;
    let id = req.params.id
    console.log(data)
    console.log(id)
    // await ProductsDAO.update({_id: id}, data)
    res.status(200).redirect('/products')
})

export default router;