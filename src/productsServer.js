import express from "express";
import ProductManager from "./app.js";

const app = express()
const productManager = new ProductManager('./productos.json');

app.use(express.urlencoded({extended:true}));
app.get('/products', async (req, res) => {
    const limit = req.query.limit;
    let products;
    if (limit) {
        products = await productManager.getProducts(Number(limit));
    } else {
        products = await productManager.getProducts();
    }
    res.send(products);
    });
  
app.get('/products/:pid', async (req, res) => {
    const pid = Number(req.params.pid);
    const product = await productManager.getProductById(pid);
    if (product) {
        res.send(product);
    } else {
        res.status(404).send({ error: "Product not found" });
    }
    });

app.listen(8080,()=>{
    console.log("connectados")
})