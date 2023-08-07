import CartModel from "../models/cart.schema.js";
import ProductModel from "../models/product.schema.js";

export default class CartManager{
    async getCarts(){
        try{
            const cartModel = await CartModel.find()
            
            if(!cartModel.length) return { status: 404, response: "Carts not found."}

            const carts = cartModel.map(cart => ({ id: cart._id, products: cart.products }))
            console.log(carts)
            this.carts = carts;
            return this.carts;
        }catch(error){
            console.log(`error: ${error}`)
        }
    }

    async getCartById(id){
        try{
            const cartFound = await CartModel.find({ _id: id })
            
            if(!cartFound) return { status: 404, response: "Cart not found" }

            return { status: 200, ok: true, response: cartFound }
        }catch(error){
            console.log(`error: ${error}`)
        }
    }

    async createCart(){
        try{
            await CartModel.create({ products: []})
        
            return { status: 200, response: "Cart created." }
        }catch(error){
            console.log(`error: ${error}`)
        } 
    }

    async addProductToCart(cartId, productId){
        try {
            const producto= await ProductModel.findById(productId)
            const cart = await CartModel.findById(cartId);
            if (!cart) {
                return { status: 404, response: "Carrito no encontrado." } 
                
            }else if(!producto){
                return { status: 404, response: "Producto no encontrado." } 
                
            }

            const prodIndex = cart.products.findIndex(
                (prod) => prod.product === productId
            );
            if (prodIndex !== -1) {
                cart.products[prodIndex].quantity++;
            } else {
                const newProduct = { product: productId, quantity: 1 };
                cart.products.push(newProduct);
            }

            await cart.save();
            console.log(`se agrego ${productId} al carrito ${cartId}`)
            return true;
        } catch (error) {
            throw new Error("No se logro agregar al carrito " + error);
        }
    }
    



    async deleteCart(id){
        try{
            const cartFound = await CartModel.find({ _id: id })

            if(!cartFound) return { status: 404, response: "Carrito no encontrado." }

            await CartModel.deleteOne({ _id: id })

            return { status: 200, response: "Carito borrado." }
        }catch(error){
            console.log(`error: ${error}`)
        }
    }
}