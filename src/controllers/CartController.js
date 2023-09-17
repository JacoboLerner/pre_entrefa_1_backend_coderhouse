import * as CartServices from "../services/CartServices.js"

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
        const cart = await CartServices.GetCarttById(cartID);
        const products = cart.products;
        const id = cart._id
        res.render("cart", { products,id});
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al obtener los datos");
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
    console.log(deletedCart);
    res.send(deletedCart);
}

export const ModifyProductInCart =  async (req, res) => {
    const cid = req.params.cid;
    const prod = req.body;
    console.log(cid, prod);
    const updatedCart = await CartServices.ModifyProductInCart(cid, prod);
    console.log("a ver", updatedCart);
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
        const cid = req.params.cid
        const pid = req.params.pid
        const result = await CartServices.AddProductToCart(cid, pid)
        res.status(201).send(result)
    }catch(e){
        res.status(502).send({ error: "Numero de producto/carrito incorrecto" });   
        }
}