import Products from '../../schemas/products.schema.js';
import fs from 'fs'
import __dirname from '../../utils/utils.js';
import { parse } from 'path';

class ProductsFileSystem {

    static async getAll(page, limit, filter) {
        const products = await fs.promises.readFile("MOCK_DATA.json", 'utf-8')
        const parsedProducts = JSON.parse(products);
        return  {docs: parsedProducts};
    }

    static async getAllWithStock() {
       await this.getAll()
    }

    static async getAllAscending(page, limit, filter) {
        return Products.paginate({filter}, {page, limit, lean: true, sort: {price: 1}})
    }

    static async getAllDescending(page, limit, filter) {
        return Products.paginate({filter}, {page, limit, lean: true, sort: {price: -1}})
    }

    static async getById(id) {
        return Products.findOne({_id: id}).lean()
    }

    static async add(title, description, photo, price, stock) {
        return new Products({title, description, photo, price, stock}).save();
    }

    static async update(id, data) {
        return Products.findOneAndUpdate({ _id: id}, data)
    }

    static async remove(id) {
        return Products.findByIdAndDelete(id);
    }

}


export default ProductsFileSystem;