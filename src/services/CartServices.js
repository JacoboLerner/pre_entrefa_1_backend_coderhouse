import * as CartDao from "../dao/cartDao.js"

export const GetAllCarts = async()=>{
    const result = await CartDao.GetAllCarts()
    if (!result) return new Error("Carritos no se pudieron encontrar!");
    return result
}
export const CreateCart = async(products)=>{
    const result = await CartDao.CreateCart(products)
    if (!result) return new Error("Carrito no se pudo crear!");
    return result
}
export const GetCarttById = async(cartID)=>{
    const result = await CartDao.GetCarttById(cartID);
    if (!result) return new Error("Carrito no se pudo encontrar!");
    return result
}
export const DeleteProductById = async(cid, pid)=>{
    const result = await CartDao.DeleteProductById(cid, pid);
    if (!result) return new Error("Producto no se pudo eliminar!");
    return result
}
export const DeleteCartById = async(cid)=>{
    const result = await CartDao.DeleteCartById(cid);
    if (!result) return new Error("Carrito no se pudo vaciar!");
    return result
}
export const ModifyProductInCart = async(cid, prod)=>{
    const result = await CartDao.ModifyProductInCart(cid, prod);
    if (!result) return new Error("Producto no se pudo modificar!");
    return result
}
export const UpdateQuantity = async(cid,pid,quantity)=>{
    const result = await CartDao.UpdateQuantity(cid,pid,quantity)
    if (!result) return new Error("Producto no se pudo actulizar en cantidad!");
    return result
}
export const AddProductToCart = async(cid, pid)=>{
    const result = await CartDao.AddProductToCart(cid, pid)
    if (!result) return new Error("Producto no se pudo agregar!");
    return result
}
