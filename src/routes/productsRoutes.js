import { Router } from "express";
const productsRouter = Router();
import * as ProductController from "../controllers/ProductsController.js"


productsRouter.get('/', ProductController.GetAllProducts);

productsRouter.get('/:pid', ProductController.GetProductById);

productsRouter.post('/',ProductController.PostProduct)
    
productsRouter.put('/:pid',ProductController.UpdateProductById)

productsRouter.delete('/:pid', ProductController.DeleteProductbyId);

export default productsRouter;
