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

    async getCartById(id) {
        try {
            const cartFound = await CartModel
                .findById(id)
                .populate("products.product")
                .lean();
            if (cartFound) {
                return cartFound;
            } else {
                return "Not Found";
            }
            
        } catch (error) {
            throw new Error("Could not get cart");
        }
    }

    async createCart(){
        try{
            const newCart= await CartModel.create({ products: []})
        
            return newCart;
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
                (prod) => prod.product == productId
            );
            console.log(prodIndex)
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
    
    async updateWholeCart(cid, prod) {
        try {
            const updatedCart = await CartModel.findOneAndUpdate(
                { _id: cid },
                { products: prod }
            );
            console.log("Carrito actualizado", updatedCart);
            return updatedCart;
        } catch (error) {
            console.log(error);
        }
    }

    async updateQuantity(cid, pid, quantity) {
        try {
            const currentCart = await CartModel.findById(cid);
            console.log(pid)
            const indexProduct = currentCart.products.findIndex((item) => item.product._id == pid);
            console.log(indexProduct)
            if (indexProduct !== -1) {
              currentCart.products[indexProduct].quantity = quantity;
              console.log(`Cantidad actualizada exitosamente`)
              
            } else {
              return 'Product not found on cart'
            }
            await currentCart.save()
            return currentCart;
            
          } catch (error) {
            console.error(`Error trying to update product quantity: ${error}`);
          }
        };

    async deleteProdFromCart(cid, pid) {
        try {
            let cart = await CartModel.findById(cid);
            const prodIndex = cart.products.findIndex(
                (prod) => prod.product == pid
            );
            if (cart.products[prodIndex].quantity > 1) {
                cart.products[prodIndex].quantity--;
            } else {
                cart = await CartModel.findOneAndUpdate({ _id: cid }, { $pull: { products: { product: pid } } }, { 'new': true });
            }
            await cart.save();
            return cart;
        } catch (error) {
            console.log(error)
        }
    }
    
    async emptyCart(cid) {
        try {
            const cart = await CartModel.findById(cid);
            cart.products = [];
            await cart.save();
            return cart;
        } catch (err) {
            console.error(err);
            // console.log("no se pudo vaciar");
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