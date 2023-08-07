import { Router } from 'express';
import CartManager from '../dao/mongo/cartManager.js';
import ProductManager from '../dao/mongo/productManager.js';
const cartRouter = new Router();
const CartService = new CartManager('./src/db/carts.json')
const productManager = new ProductManager('./src/db/productos.json');

cartRouter.get('/', async (req, res) => {
    try{
        const result = await CartService.getCarts()
        res.send(result)
    }catch(e){
        res.status(502).send({ error: "true" });   
        }
    })

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
        const cid = (req.params.cid)
        const result= await CartService.getCartById(cid)
        res.send(result)
    }
    catch(e){
        res.status(502).send({ error: "true" });   
        }
})

cartRouter.post('/:cid/product/:pid', async (req, res) => {
    try{
        const cid = req.params.cid
        const pid = req.params.pid
        const result = await CartService.addProductToCart(cid, pid)
        res.status(201).send(result)
    }catch(e){
        res.status(502).send({ error: "Numero de producto/carrito incorrecto" });   
        }
})



export default cartRouter