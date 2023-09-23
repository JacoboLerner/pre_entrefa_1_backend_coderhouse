import { Router } from 'express';
const cartRouter = new Router();
import * as CartController from "../controllers/CartController.js"
import { userAdminControl } from '../utils/secure.middleware.js';

cartRouter.get('/', CartController.GetAllCarts)

cartRouter.post('/', CartController.CreateCart)

cartRouter.get("/:cid", CartController.GetCarttById);

cartRouter.delete("/:cid/product/:pid", CartController.DeleteProductById);

cartRouter.delete("/:cid", CartController.DeleteCartById);

cartRouter.put("/:cid", CartController.ModifyProductInCart);

cartRouter.put("/:cid/product/:pid", CartController.UpdateQuantity);
//restriccion solo usuario puede agregar productos
cartRouter.post('/:cid/product/:pid',userAdminControl, CartController.AddProductToCart)

cartRouter.get('/:cid/purchase', CartController.purchaseCart);



export default cartRouter