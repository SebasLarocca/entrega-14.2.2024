import Products from '../../schemas/products.schema.js';


class ProductsDAO {

    static async getAll(page, limit, filter) {
        // let parsedFilter = await JSON.parse(filter)
        let prods = await Products.paginate(filter, {page, limit, lean: true})
        return prods;
    }

    static async getAllWithStock() {
        return Products.paginate({stock: {$gt:0}}, {page:1, limit:5, lean: true})
    }

    static async getAllAscending(page, limit, filter) {
        return Products.paginate({filter}, {page, limit, lean: true, sort: {price: 1}})
    }

    static async getAllDescending(page, limit, filter) {
        return Products.paginate({filter}, {page, limit, lean: true, sort: {price: -1}})
    }

    static async getById(id) {
        return Products.findOne({_id: id}).lean().populate('owner')
    }

    static async add(title, description, photo, price, stock, owner) {
        return new Products({title, description, photo, price, stock, owner}).save();
    }

    static async update(id, data) {
        return Products.findOneAndUpdate({ _id: id}, data)
    }

    // static async uptate(id, data) {
    //     return Products.findOneAndUpdate({ _id: id}, data)
    // }

    static async remove(id) {
        return Products.findByIdAndDelete(id);
    }

}


export default ProductsDAO;