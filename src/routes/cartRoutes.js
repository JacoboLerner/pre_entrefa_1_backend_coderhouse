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
        const products = req.body;
        const result = await CartService.createCart(products)
        res.send(result)
    }catch(e){
        res.status(502).send({ error: "true" });   
        }
    })


cartRouter.get("/:cid", async (req, res) => {
    try {
        const cartID = req.params.cid;
        const cart = await CartService.getCartById(cartID);
        const products = cart.products;
        const id = cart._id
        res.render("cart", { products,id});
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al obtener los datos");
    }
});

cartRouter.delete("/:cid/product/:pid", async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const deleted = await CartService.deleteProdFromCart(cid, pid);
    res.send(deleted);
});

cartRouter.delete("/:cid", async (req, res) => {
    const cid = req.params.cid;
    const deletedCart = await CartService.emptyCart(cid);
    console.log(deletedCart);
    res.send(deletedCart);
});

cartRouter.put("/:cid", async (req, res) => {
    const cid = req.params.cid;
    const prod = req.body;
    console.log(cid, prod);
    const updatedCart = await CartService.updateWholeCart(cid, prod);
    console.log("a ver", updatedCart);
    res.send(updatedCart);
});

cartRouter.put("/:cid/product/:pid", async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const quantity = req.body.quantity;
    const updatedQuantity = await CartService.updateQuantity(
        cid,
        pid,
        quantity
    );
    res.send(updatedQuantity);
});

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