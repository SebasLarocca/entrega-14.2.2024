import { Router } from "express";
import { ProductsDAO } from "../daos/products.factory.js"
import UsersDAO from "../daos/mongo.dao/users.dao.js";
import CartsDao from "../daos/mongo.dao/cart.dao.js"
import upload from "../utils/upload.middleware.js";
import authenticate from "../middlewares/authentication.js";
import authorization from "../middlewares/authorization.js";
import { getUserByID } from "../dtos/user.dto.js";

const router = Router();

//Pantalla de inicio: muestra los productos, permite filtros.
router.get('/',
    authenticate,
    authorization(["client", "admin", "premium"]),
    async (req, res) => {
        let user = req.user
        const userData = await getUserByID(user)
        let withStock = req.query.stock;
        let ascending = req.query.ascending
        let descending = req.query.descending
        let products;
        let cartExists = await CartsDao.cartExists(user)
        let cart;
        if (cartExists) {
            cart = await CartsDao.getCartByUser(user)
        } else {
            cart = await CartsDao.createCart(user)
            cart = [cart]
        }
        if (withStock != undefined) {
            products = await ProductsDAO.getAllWithStock()
        } else if (ascending != undefined) {
            let page = parseInt(req.query.page)
            let limit = parseInt(req.query.limit)
            let filter = req.query.filter
            if (!filter) filter = null
            if (!limit) limit = 10
            if (!page) page = 1
            products = await ProductsDAO.getAllAscending(page, limit, filter)
            products.prevLink = products.hasPrevPage ? `http://localhost:8080/products?page=${products.prevPage}` : ''
            products.nextLink = products.hasNextPage ? `http://localhost:8080/products?page=${products.nextPage}` : ''
            products.isValid = !(page <= 0 || page > products.totalPages)
        } else if (descending != undefined) {
            let page = parseInt(req.query.page)
            let limit = parseInt(req.query.limit)
            let filter = req.query.filter
            if (!filter) filter = null
            if (!limit) limit = 10
            if (!page) page = 1
            products = await ProductsDAO.getAllDescending(page, limit, filter)
            products.prevLink = products.hasPrevPage ? `http://localhost:8080/products?page=${products.prevPage}` : ''
            products.nextLink = products.hasNextPage ? `http://localhost:8080/products?page=${products.nextPage}` : ''
            products.isValid = !(page <= 0 || page > products.totalPages)
        } else {
            let page = parseInt(req.query.page)
            let limit = parseInt(req.query.limit)
            let filter = req.query.filter
            if (!filter) filter = null
            if (!limit) limit = 10
            if (!page) page = 1
            products = await ProductsDAO.getAll(page, limit, filter);
            products.prevLink = products.hasPrevPage ? `http://localhost:8080/products?page=${products.prevPage}` : ''
            products.nextLink = products.hasNextPage ? `http://localhost:8080/products?page=${products.nextPage}` : ''
            products.isValid = !(page <= 0 || page > products.totalPages)
        }
        let object = {
            status: res.status,
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.prevLink,
            nextLink: products.nextLink
        }
        let cartId = cart[0]._id.toString()
        res.render('products', { products, userData, cartId })
    })

//Renderiza vista de agregar nuevo producto
router.get("/new", authenticate, authorization(["admin", "premium"]), (req, res) => {
    res.render('new-product')
})

//Vista para eliminar productos
router.get("/admin", authenticate, authorization(["admin", "premium"]), async (req, res) => {
    const user = req.user
    // const filter = req.user.
    let products;
    (user.role === "admin") ?
        products = await ProductsDAO.getAll(1, 100, null)
        : products = await ProductsDAO.getAll(1, 100, { owner: user._id })

    res.render("adminManagement", { products })
})

//Muestra un producto individual
router.get('/:id', authenticate, authorization(["client", "admin"]), async (req, res) => {
    let id = req.params.id;
    if (!id) {
        res.redirect('/products')
    }
    let product = await ProductsDAO.getById(id)
    if (!product) {
        res.render('404')
    }
    console.log(product.owner.first_name);
    res.render('product', {
        title: product.title,
        description: product.description,
        photo: product.photo,
        price: product.price,
        isStock: product.stock > 0
    })
})

//Crean productos los usuarios admin y premium.
router.post('/',
    authenticate,
    authorization(["admin", "premium"]),
    upload.single('image'),
    async (req, res) => {
        let filename = req.file.filename;
        let product = req.body
        let user = req.user
        const owner = req.session.user;
        console.log({ owner: owner });
        console.log({ user: user });
        await ProductsDAO.add(product.title, product.description, filename, product.price, product.stock, owner);
        res.redirect('/products');
    })

//Modifica un producto existente. Si es premium chequea que sea el owner. 
//Caso contrario es admin y lo permite
//Chequear funcionamiento

router.post('/update/:id', authenticate, authorization(["admin", "premium"]), async (req, res) => {
    let data = req.body
    let id = req.params.id
    const user = req.user

    if (user.role === "premium") {
        const product = await ProductsDAO.getById(id)
        product.owner === user._id
            ? await ProductsDAO.update({ _id: id }, data)
            : res.status(403).redirect('/products');
    } else {
        await ProductsDAO.update({ _id: id }, data);
        res.status(200).redirect('/products');
    }
})

//Borrar un producto
router.post('/:id', authenticate, authorization(["admin", "premium"]), async (req, res) => {
    let productToDelete = req.params.id;
    await ProductsDAO.remove(productToDelete);
    res.status(201).redirect("/products")
})

export default router;