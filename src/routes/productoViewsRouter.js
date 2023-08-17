import { Router } from "express";
import ProductManager from "../dao/mongo/productManager.js";
const productManager = new ProductManager('./src/db/productos.json');
import { isAuthenticated } from "../utils/secure.middleware.js";
const productsViewsRouter = Router();

 productsViewsRouter.get("/", isAuthenticated,async (req, res) => {
   const userInfo = {
      first_name: req.session.user.first_name,
      last_name: req.session.user.last_name,
      email: req.session.user.email,
      age: req.session.user.age,
    };
    const products= await productManager.getProducts();
     res.render("home",  {products,userInfo});
  });

  productsViewsRouter.get("/realtimeproducts", async (req, res) => {
    res.render("realTimeProducts", {});})


export default productsViewsRouter;

