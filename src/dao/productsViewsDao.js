//capa de persistencia
import ProductManager from "./mongo/productManager.js";
const productManager = new ProductManager('../db/productos.json');

export const find = async ()=>{
    const products = await productManager.getProducts();
    return products;
}