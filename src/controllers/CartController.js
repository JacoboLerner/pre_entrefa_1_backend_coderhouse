import CartModel from "../models/cart.schema.js";
import ProductModel from "../models/product.schema.js";
import Ticket from "../models/ticket.schema.js";
import User from "../models/user.schema.js";
import * as CartServices from "../services/CartServices.js"
import logger from "../config/loggers/factory.js";

export const GetAllCarts = async (req, res) => {
    try{
        const result = await CartServices.GetAllCarts()
        res.send(result)
    }catch(e){
        res.status(502).send({ error: "true" });   
        }
    }

export const CreateCart = async (req, res) => {
    try{
        const products = req.body;
        const result = await CartServices.CreateCart(products)
        res.send(result)
    }catch(e){
        res.status(502).send({ error: "true" });   
        }
    }

export const GetCarttById = async (req, res) => {
    try {
        const cartID = req.params.cid;
        const cart = await CartServices.GetCarttById(cartID)
        if (!cart) {
            res.status(404).json({
                error: 'Carrito no encontrado'
            });
            return;
        }
        // Obtener la información completa de los productos utilizando el populate
        const productsWithInfo = await ProductModel.populate(cart, {
            path: 'products.product',
            model: 'products',
        });
        res.status(200).json(productsWithInfo);
    } catch (error) {
        logger.ERROR('Error al obtener los productos del carrito:', error);
        res.status(500).json({
            error: 'Error en el servidor'
        });
    }
}

export const DeleteProductById= async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const deleted = await CartServices.DeleteProductById(cid, pid);
    res.send(deleted);
}

export const DeleteCartById= async (req, res) => {
    const cid = req.params.cid;
    const deletedCart = await CartServices.DeleteCartById(cid);
    logger.INFO(deletedCart);
    res.send(deletedCart);
}

export const ModifyProductInCart =  async (req, res) => {
    const cid = req.params.cid;
    const prod = req.body;
    logger.INFO(cid, prod);
    const updatedCart = await CartServices.ModifyProductInCart(cid, prod);
    logger.INFO("a ver", updatedCart);
    res.send(updatedCart);
}


export const UpdateQuantity =  async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const quantity = req.body.quantity;
    const updatedQuantity = await CartServices.UpdateQuantity(cid,pid,quantity
    );
    res.send(updatedQuantity);
}

export const AddProductToCart =async (req, res) => {
    try{
        const userId = req.session.user._id;
        const cid = req.params.cid
        const pid = req.params.pid 
        const result = await CartServices.AddProductToCart(cid, pid,userId)
        res.status(201).send(result)
    }catch(e){
        res.status(502).send({ error: "Numero de producto/carrito incorrecto" });   
        }
}

export const purchaseCart = async (req, res) => {
    try {
        const cartId = req.params.cid;
      // Obtener el carrito
    const cart = await CartServices.GetCarttById(cartId)  
      if (!cart) {
        res.status(404).json({ error: 'Carrito no encontrado' });
        return;
      }

    let totalAmount = 0; // Monto total de la compra
    const purchasedProducts = []; // Productos que se han comprado 
      // Filtrar los productos que se pueden comprar y actualizar el monto total
    const unprocessedProducts = cart.products.filter(item => {
    const product = item.product;
    if (product.stock >= item.quantity) {
          product.stock -= item.quantity; // Actualizar stock del producto
          totalAmount += product.price * item.quantity; // Actualizar monto total
          purchasedProducts.push(item); // Agregar a los productos comprados
          return false; // Producto comprado y procesado
        }  
        return true; // Producto no procesado
    });  
    if (purchasedProducts.length === 0) {
        res.status(400).json({ error: 'No se pudo procesar ninguna compra' });
        return;
    }  
      // Actualizar los stocks de los productos comprados
    await Promise.all(purchasedProducts.map(async item => {
        const product = await ProductModel.findById(item.product._id);
        product.stock -= item.quantity;
        await product.save();
      }));

      // Crear un ticket con los datos de la compra
    const ticketData = {
            amount: totalAmount,
            purchaser: req.session.user.email,
    };

    const newTicket = await Ticket.create(ticketData);

      // Actualizar el carrito del usuario con los productos no procesados
    if (newTicket) {
        const cartNuevo = await CartModel.findById(cartId)
        cartNuevo.products = unprocessedProducts;
        await cartNuevo.save()
    }

    res.status(200).json({
        purchasedProducts,
        unprocessedProducts,
        ticket: newTicket
        });
        }
    catch (error) {
        logger.INFO('Error al finalizar la compra:', error);
        res.status(500).json({
            error: 'Error en el servidor'
        });
    }
    }