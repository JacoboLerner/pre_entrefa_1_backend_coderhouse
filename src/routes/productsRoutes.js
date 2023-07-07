import { Router } from "express";
import ProductManager from "../managers/productManager.js";
const productManager = new ProductManager('./src/db/productos.json');
const productsRouter = Router();

productsRouter.get('/', async (req, res) => {
    const limit = req.query.limit;
    let products;
    if (limit) {
        products = (await productManager.getProducts()).slice(0,limit);
    } else {
        products = await productManager.getProducts();
    }
    res.send(products);
    });

productsRouter.get('/:pid', async (req, res) => {
        const pid = Number(req.params.pid);
        const product = await productManager.getProductById(pid);
        if (product) {
            res.send(product);
        } else {
            res.status(502).send({ error: "Product not found" });
        }
        });

productsRouter.post('/',async(req,res)=>{
        const body=req.body
        if (!body.title || !body.description || !body.price || !body.thumbnail || !body.code || !body.stock  || !body.category ){
            res.send({error:true, msg: "Contenido faltante"})
        }else{
        try{
            const result= await productManager.addProduct(body)
        res.send(result)
        }catch(e){
        res.status(502).send({ error: "true" });
        }
        }
        })
    
productsRouter.put('/:pid',async(req,res)=>{
        try{
            const{pid}=req.params;
            const product=req.body
            const result=await productManager.updateProduct(pid,product)
            res.send({update:true})
        }catch(e){
        res.status(502).send({ error: "true" });   
        }
    })

productsRouter.delete('/:pid', async (req, res) => {
        try{
            const pid = Number(req.params.pid);
            const product = await productManager.deleteProductbyId(pid);
            res.send({delete:true});
        }catch(e){
            res.status(502).send({ error: "true" });   
            }
        });

export default productsRouter;
