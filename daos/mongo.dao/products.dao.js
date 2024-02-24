import Products from '../../schemas/products.schema.js';

class ProductsDAO {

    static async getAll(page) {
        return Products.paginate({}, {page, limit:5, lean: true});
    }

    static async getAllWithStock() {
        return Products.paginate({stock: {$gt:0}}, {page:1, limit:5, lean: true})
    }

    static async getAllAscending() {
        return Products.paginate({}, {page:1, limit:5, lean: true, sort: {price: 1}})
    }

    static async getAllDescending() {
        return Products.paginate({}, {page:1, limit:5, lean: true, sort: {price: -1}})
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


export default ProductsDAO;