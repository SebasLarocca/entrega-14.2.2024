import { faker } from "@faker-js/faker";
//docu interesante https://fakerjs.dev/api/

export const fakerTest = () => {
    let products = []
    for (let i = 0; i < 10; i++) {
        let product = {}
        product._id = faker.number.int({ min: 1000000000000000, max: 9999999999999999 }).toString()
        product.title = faker.commerce.productName()
        product.description = faker.commerce.productDescription()
        product.price = faker.commerce.price()
        product.stock = faker.number.int({ min: 0, max: 100 })
        product.photo = faker.image.avatar()
        products.push(product)
    }
    return products

}