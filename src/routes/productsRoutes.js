import { Router } from "express";
import ProductManager from "../dao/mongo/productManager.js";
const productManager = new ProductManager('./src/db/productos.json');
const productsRouter = Router();
import ProductModel from "../dao/models/product.schema.js";

productsRouter.get('/', async (req, res) => {
    try{
        const products= await ProductModel.find()
        res.send(products);
    }catch(e){
        res.status(502).send({ error: "true" })
        console.log(e);
    }

    });

productsRouter.get('/:pid', async (req, res) => {
        const pid = (req.params.pid);
        const product = await productManager.getProductById(pid);
        if (product) {
            res.send(product);
        } else {
            res.status(502).send({ error: "Product not found" });
        }
        });

productsRouter.post('/',async(req,res,)=>{
        try{
            const body=req.body
           const result = await ProductModel.insertMany([body])
        res.send(result)
        }catch(e){
        res.status(502).send({ error: "true" })
        console.log(e);
        }
        }
        )
    
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
