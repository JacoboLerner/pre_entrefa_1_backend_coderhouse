import logger from "../../config/loggers/factory.js";
import CartModel from "../../models/cart.schema.js";
import ProductModel from "../../models/product.schema.js";
import User from "../../models/user.schema.js";

export default class CartManager{
    async getCarts(){
        try{
            const cartModel = await CartModel.find()
            
            if(!cartModel.length) return { status: 404, response: "Carts not found."}

            const carts = cartModel.map(cart => ({ id: cart._id, products: cart.products }))
            logger.INFO(carts)
            this.carts = carts;
            return this.carts;
        }catch(error){
            logger.ERROR(`error: ${error}`)
        }
    }

    async getCartById(id) {
        try {
            const cartFound = await CartModel
                .findById(id)
                .populate("products.product")
                .lean()
                .exec();
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
            const newCart= await CartModel.create({ products: [],totalPrice:0})
        
            return newCart;
        }catch(error){
            logger.ERROR(`error: ${error}`)
        } 
    }

    async addProductToCart(cartId, productId,userId){
        try {
            //parte del manejo para que usuario no pueda agregar su propio producto  en caso de premium
            logger.INFO(userId)
            const user = await User.findById(userId);
            const producto= await ProductModel.findById(productId)
            const productPrice= producto.price
            const cart = await CartModel.findById(cartId);
            if (producto.owner == user.email && user.role == 'premium'){
                return { status: 404, message: "Usted no puede agregar su propio producto a carrito." };
            }
            if (!cart) {
                return { status: 404, response: "Carrito no encontrado." } 
                
            }else if(!producto){
                return { status: 404, response: "Producto no encontrado." } 
                
            }
            
            const prodIndex = cart.products.findIndex(
                (prod) => prod.product == productId
            );
            if (prodIndex !== -1) {
                cart.products[prodIndex].quantity++;
                cart.products[prodIndex].total=cart.products[prodIndex].price * cart.products[prodIndex].quantity;
            } else {
                const newProduct = { product: productId, price:productPrice, quantity: 1, total:productPrice };
                cart.products.push(newProduct);
            }
            const newtotalPrice = cart.products.reduce((sum, product) => sum + product.total, 0)
            console.log(newtotalPrice);
            await CartModel.findByIdAndUpdate(cartId, { products: cart.products ,totalPrice:newtotalPrice}).exec();

            await cart.save();
            logger.INFO(`se agrego ${productId} al carrito ${cartId}, tiene un precio de ${productPrice}`)
            return true;
        } catch (error) {
            throw new Error("No se logro agregar al carrito " + error);
        }
    }
    
    async updateWholeCart(cid, prod) {
        try {
            const updatedCart = await CartModel.findOneAndUpdate(
                { _id: cid },
                { products: prod },{new:true}
            );
           logger.INFO("Carrito actualizado", updatedCart);
           return { status: 200, response: "Carrito actualizado." }
        } catch (error) {
            logger.ERROR(error);
        }
    }

    async updateQuantity(cid, pid, quantity) {
        try {
            const currentCart = await CartModel.findById(cid);
            console.log(pid)
            const indexProduct = currentCart.products.findIndex((item) => item.product._id == pid);
            if (indexProduct !== -1) {
              currentCart.products[indexProduct].quantity = quantity;
              logger.INFO(`Cantidad actualizada exitosamente`)
              
            } else {
              return 'Product not found on cart'
            }
            await currentCart.save()
            return currentCart;
            
          } catch (error) {
            logger.ERROR(`Error trying to update product quantity: ${error}`);
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
            logger.ERROR(error)
        }
    }
    
    async emptyCart(cid) {
        try {
            const cart = await CartModel.findById(cid);
            cart.products = [];
            await cart.save();
            return cart;
        } catch (err) {
            logger.ERROR(err);
            // console.log("no se pudo vaciar");
        }
    }

    async deleteCart(id){
        try{
            const cartFound = await CartModel.find({ _id: id })

            if(!cartFound) return { status: 404, response: "Carrito no encontrado." }

            await CartModel.deleteOne({ _id: id })

            return { status: 200, response: "Carrito borrado." }
        }catch(error){
            logger.ERROR(`error: ${error}`)
        }
    }
}