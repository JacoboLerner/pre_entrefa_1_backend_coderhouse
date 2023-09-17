import { Router } from "express";
import * as ProductsViewsController from "../controllers/productsViewsController.js"
import { isAuthenticated } from "../utils/secure.middleware.js";
const productsViewsRouter = Router();

productsViewsRouter.get("/", isAuthenticated,ProductsViewsController.GetAllProducts);

productsViewsRouter.get("/realtimeproducts", ProductsViewsController.GetAllRealTimeProducts)


export default productsViewsRouter;

