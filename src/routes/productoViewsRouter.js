import { Router } from "express";
import * as ProductsViewsController from "../controllers/productsViewsController.js"
import { isAdmin, isAuthenticated } from "../utils/secure.middleware.js";
const productsViewsRouter = Router();
//cambios para acceso solo por admin

productsViewsRouter.get("/", isAuthenticated,ProductsViewsController.GetAllProducts);

productsViewsRouter.get("/realtimeproducts",isAdmin, ProductsViewsController.GetAllRealTimeProducts)

productsViewsRouter.get('/carts/:cid', ProductsViewsController.readViewsCartController)


export default productsViewsRouter;

