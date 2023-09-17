import CartManager from '../dao/mongo/cartManager.js';
const CartService = new CartManager('./src/db/carts.json')

export const GetAllCarts = async()=>{
    const result = await CartService.getCarts()
    return result
}
export const CreateCart = async(products)=>{
    const result = await CartService.createCart(products)
    return result
}
export const GetCarttById = async(cartID)=>{
    const result = await CartService.getCartById(cartID);
    return result
}
export const DeleteProductById = async(cid, pid)=>{
    const result = await CartService.deleteProdFromCart(cid, pid);
    return result
}
export const DeleteCartById = async(cid)=>{
    const result = await CartService.emptyCart(cid);
    return result
}
export const ModifyProductInCart = async(cid, prod)=>{
    const result = await CartService.updateWholeCart(cid, prod);
    return result
}
export const UpdateQuantity = async(cid,pid,quantity)=>{
    const result = await CartService.updateQuantity(cid,pid,quantity)
    return result
}
export const AddProductToCart = async(cid, pid)=>{
    const result = await CartService.addProductToCart(cid, pid)
    return result
}
