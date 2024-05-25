export let ProductsDAO;

switch(process.argv[2]){
    case "mongo":
        const {default: ProductsMongo} = await import('./mongo.dao/products.dao.js');
        ProductsDAO = ProductsMongo;
        break;
    case "fileSystem":
        const {default: ProductsFileSystem} = await import('./fileSistem.dao/fileSistem.products.dao.js')
        ProductsDAO = ProductsFileSystem;
        break;
    }

