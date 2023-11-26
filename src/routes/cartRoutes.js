import { Router } from 'express';
const cartRouter = new Router();
import * as CartController from "../controllers/CartController.js"
import { userAdminControl, userOrPremium } from '../utils/secure.middleware.js';

cartRouter.get('/', CartController.GetAllCarts)

cartRouter.get('/:cid',userOrPremium, CartController.returnOwnerCart)

cartRouter.post('/',userOrPremium, CartController.CreateCart)

cartRouter.post('/test', CartController.CreateCart)

cartRouter.get("/test/:cid", CartController.GetCarttById);

cartRouter.delete("/:cid/product/:pid",userOrPremium, CartController.DeleteProductById);

cartRouter.delete("/:cid", CartController.DeleteCartById);

cartRouter.delete("/test/:cid", CartController.DeleteCart);

cartRouter.put("/:cid",userOrPremium, CartController.ModifyProductInCart);

cartRouter.put("/test/:cid", CartController.ModifyProductInCart);

cartRouter.put("/:cid/product/:pid", CartController.UpdateQuantity);
//restriccion solo usuario puede agregar productos
cartRouter.post('/:cid/product/:pid',userOrPremium, CartController.AddProductToCart)

cartRouter.get('/:cid/purchase', CartController.purchaseCart);



export default cartRouter