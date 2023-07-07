import { Router } from 'express';
import CartManager from '../managers/cartManager.js';
import ProductManager from '../managers/productManager.js';
const cartRouter = new Router();
const CartService = new CartManager('./src/db/carts.json')
const productManager = new ProductManager('./src/db/productos.json');


cartRouter.post('/', async (req, res) => {
    try{
        const result = CartService.createCart()
        res.send(result)
    }catch(e){
        res.status(502).send({ error: "true" });   
        }
    })


cartRouter.get('/:cid', async (req, res) => {
    try{
        const result= await CartService.cartList(req.params.cid)
        res.send(result)
    }
    catch(e){
        res.status(502).send({ error: "true" });   
        }
})

cartRouter.post('/:cid/product/:pid', async (req, res) => {
    const cid = Number(req.params.cid)
    const pid = Number(req.params.pid)
    const prod = await productManager.getProductById(pid);
    if (prod){
        const result = await CartService.addToCart(cid,prod);
        result !== null
        ? res.status(200).json({"success" : "Producto Agregado",result})
        : res.status(404).json({"error": "Carrito no encontrado ID Inexistente"})
    }else {
        res.status(404).json({"error": "ID Ingresado Inexistente"})
    }
})



export default cartRouter