import { Router } from "express";
const productsRouter = Router();
import * as ProductController from "../controllers/ProductsController.js"
import { isAuthenticated } from "../utils/secure.middleware.js";
import passport from "passport";

productsRouter.get('/', isAuthenticated, ProductController.GetAllProducts);

productsRouter.get('/json',passport.authenticate("jwt",{session:false}), ProductController.GetProductsTotal);

productsRouter.get('/:pid',isAuthenticated, ProductController.GetProductById);

productsRouter.post('/',passport.authenticate("jwt",{session:false}),ProductController.PostProduct)
    
productsRouter.put('/:pid',passport.authenticate("jwt",{session:false}),ProductController.UpdateProductById)

productsRouter.delete('/:pid',passport.authenticate("jwt",{session:false}), ProductController.DeleteProductbyId);

export default productsRouter;
