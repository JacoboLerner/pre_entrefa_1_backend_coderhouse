import { Router } from "express";
import ProductManager from "../dao/mongo/productManager.js";
const productManager = new ProductManager('./src/db/productos.json');
const productsViewsRouter = Router();

 productsViewsRouter.get("/", async (req, res) => {
    const products= await productManager.getProducts();
     res.render("home",  {products});
  });

  productsViewsRouter.get("/realtimeproducts", async (req, res) => {
    res.render("realTimeProducts", {});})


export default productsViewsRouter;

