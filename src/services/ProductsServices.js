import * as ProductDao from "../dao/productDao.js"

export const GetAllProducts = async (category, limit,lean,page,sort) =>{
    const product = await ProductDao.findall(category, limit,lean,page,sort)
    if (!product) return new Error("Producto no se pudo organizar!");
    return product;
}

export const GetOneProductById = async (id) =>{
    const product = await ProductDao.findOne(id)
    if (!product) return new Error("Producto no existe!");
    return product;
}

export const PostNewProduct = async (producto) =>{
    const product = await ProductDao.addProduct(producto)
    if (!product) return new Error("Producto no se pudo agregar");
    return product;
}

export const UpdateProduct = async (pid,product) =>{
    const producto = await ProductDao.UpdateProduct(pid,product)
    if (!producto) return new Error("Producto no se pudo modificar");
    return producto;
}

export const DeleteProductId = async (id) =>{
    const product = await ProductDao.DeleteProduct(id)
    return product

}