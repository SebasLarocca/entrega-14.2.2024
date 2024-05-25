import { Router } from "express";
import {ProductsDAO} from "../daos/products.factory.js"
import UsersDAO from "../daos/mongo.dao/users.dao.js";
import upload from "../utils/upload.middleware.js";
import authenticate from "../middlewares/authentication.js";
import authorization from "../middlewares/authorization.js";

const router = Router();

router.get('/', authenticate, authorization(["client", "admin"]), async (req, res) => {
    let user = req.user
    let userData = await UsersDAO.getUserByID(user)
    let withStock = req.query.stock;
    let ascending = req.query.ascending
    let descending = req.query.descending
    let products;
    if (withStock != undefined) {
        products = await ProductsDAO.getAllWithStock()
    } else if (ascending != undefined) {
        let page = parseInt(req.query.page)
        let limit = parseInt(req.query.limit)
        let filter = req.query.filter
        if(!filter) filter =null        
        if(!limit) limit=10
        if(!page) page=1
        products = await ProductsDAO.getAllAscending(page, limit, filter)
        products.prevLink = products.hasPrevPage ? `http://localhost:8080/products?page=${products.prevPage}`:''
        products.nextLink = products.hasNextPage ? `http://localhost:8080/products?page=${products.nextPage}`:''
        products.isValid = !(page<=0 || page>products.totalPages) 
    } else if (descending != undefined) {
        let page = parseInt(req.query.page)
        let limit = parseInt(req.query.limit)
        let filter = req.query.filter
        if(!filter) filter =null
        if(!limit) limit=10
        if(!page) page=1
        products = await ProductsDAO.getAllDescending(page, limit, filter)
        products.prevLink = products.hasPrevPage ? `http://localhost:8080/products?page=${products.prevPage}`:''
        products.nextLink = products.hasNextPage ? `http://localhost:8080/products?page=${products.nextPage}`:''
        products.isValid = !(page<=0 || page>products.totalPages) 
    } else {
        let page = parseInt(req.query.page)
        let limit = parseInt(req.query.limit)
        let filter = req.params.filter
        if(!filter) filter =null
        if(!limit) limit=10
        if(!page) page=1
        products = await ProductsDAO.getAll(page, limit, filter);
        products.prevLink = products.hasPrevPage ? `http://localhost:8080/products?page=${products.prevPage}`:''
        products.nextLink = products.hasNextPage ? `http://localhost:8080/products?page=${products.nextPage}`:''
        products.isValid = !(page<=0 || page>products.totalPages)        
    }
    let object = {
        status: res.status,
        payload: products.docs,
        totalPages:products.totalPages,
        prevPage:products.prevPage,
        nextPage: products.nextPage,
        page: products.page,
        hasPrevPage:products.hasPrevPage,
        hasNextPage:products.hasNextPage,
        prevLink: products.prevLink,
        nextLink:products.nextLink 
    }
    res.render('products', {products, userData} )
})

router.get("/new",authenticate, authorization(["admin"]),(req, res) => {
    res.render('new-product')
})

router.get("/admin", authenticate,async (req, res) => {
    let products = await ProductsDAO.getAll(1, 5, null );
    res.render("adminManagement", { products })
})

router.get('/:id', authenticate,async (req, res) => {
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

router.post('/', authenticate,upload.single('image'), async (req, res) => {
    let filename = req.file.filename;
    let product = req.body
    await ProductsDAO.add(product.title, product.description, filename, product.price, product.stock);
    res.redirect('/products');
})

router.post('/update/:id',authenticate, async (req, res) => {
    let data = req.body
    let id = req.params.id
    await ProductsDAO.update({ _id: id }, data);
    res.status(200).redirect('/products');
})

//Borrar un producto
router.post('/:id', authenticate,async (req, res) => {
    let productToDelete = req.params.id;
    await ProductsDAO.remove(productToDelete);
    res.status(201).redirect("/products")
})



export default router;