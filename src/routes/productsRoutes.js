import { Router } from "express";
const productsRouter = Router();
import * as ProductController from "../controllers/ProductsController.js"
import { isAuthenticated } from "../utils/secure.middleware.js";
//manipulacion por usuario

productsRouter.get('/', isAuthenticated, ProductController.GetAllProducts);

productsRouter.get('/:pid',isAuthenticated, ProductController.GetProductById);

productsRouter.post('/',isAuthenticated,ProductController.PostProduct)
    
productsRouter.put('/:pid',isAuthenticated,ProductController.UpdateProductById)

productsRouter.delete('/:pid',isAuthenticated, ProductController.DeleteProductbyId);

export default productsRouter;
