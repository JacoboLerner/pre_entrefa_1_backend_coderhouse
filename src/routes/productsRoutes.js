import { Router } from "express";
import ProductManager from "../dao/mongo/productManager.js";
const productManager = new ProductManager('./src/db/productos.json');
const productsRouter = Router();
import ProductModel from "../dao/models/product.schema.js";

productsRouter.get('/', async (req, res) => {
    try{
        const { page, query, limit, order } = req.query;
        let sortBy;
        if(order === "desc") {
            sortBy = -1;
        } else if (order === "asc"){
            sortBy = 1;
        }
        let products;
        if (!query) {
            products = await ProductModel.paginate(
                {},
                {
                    limit: limit ?? 10,
                    lean: true,
                    page: page ?? 1,
                    sort: { price: sortBy },
                }
            );
        } else {
            products = await ProductModel.paginate(
                { category: query},
                {
                    limit: limit ?? 3,
                    lean: true,
                    page: page ?? 1,
                    sort: { price: sortBy },
                }
            );
        }
        res.render("products", { products, query, order });
        console.log(products)
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
