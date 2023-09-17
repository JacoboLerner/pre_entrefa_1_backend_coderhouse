import ProductModel from "../models/product.schema.js";
import ProductManager from "./mongo/productManager.js";
const productManager = new ProductManager('../db/productos.json');


export const findall = async (category, limit,lean,page,sort)=>{
    const products = await ProductModel.paginate(category, limit,lean,page,sort);
    return products;
}


export const findOne = async (id)=>{
    const products = await productManager.getProductById(id);
    return products;
}

export const addProduct = async (product)=>{
    const productoAgregado = await productManager.addProduct(product);
    return productoAgregado;
}

export const UpdateProduct = async (pid,product)=>{
    const productoActualizado = await productManager.updateProduct(pid,product);
    return productoActualizado;
}

export const DeleteProduct = async (pid)=>{
    const productoBorrado = await productManager.deleteProductbyId(pid);
    return productoBorrado;
}

