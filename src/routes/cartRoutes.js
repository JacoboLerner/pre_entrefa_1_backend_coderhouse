import { Router } from 'express';
const cartRouter = new Router();
import * as CartController from "../controllers/CartController.js"

cartRouter.get('/', CartController.GetAllCarts)

cartRouter.post('/', CartController.CreateCart)

cartRouter.get("/:cid", CartController.GetCarttById);

cartRouter.delete("/:cid/product/:pid", CartController.DeleteProductById);

cartRouter.delete("/:cid", CartController.DeleteCartById);

cartRouter.put("/:cid", CartController.ModifyProductInCart);

cartRouter.put("/:cid/product/:pid", CartController.UpdateQuantity);

cartRouter.post('/:cid/product/:pid', CartController.AddProductToCart)



export default cartRouter