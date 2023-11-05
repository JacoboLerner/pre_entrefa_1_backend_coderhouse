import { Router } from "express";
import productsRouter from "./productsRoutes.js";
import cartRouter from "./cartRoutes.js";
import productsViewsRouter from "./productoViewsRouter.js"
import userRouter from "./userRoutes.js";
import sessionsRouter from './sessionsRoutes.js'
import loggerRouter from "./loggerRoutes.js"
import purchaserouter from "./mailPurchaseRoutes.js"
import mockingRouter from "./mocking.js"
import { userAdminControl } from "../utils/secure.middleware.js"
const router = Router();

router.use('/',userRouter);
router.use('/api/carts', cartRouter)
router.use('/api/products', productsRouter);
router.use('/products', productsViewsRouter);
router.use('/api/sessions', sessionsRouter); 
router.use('/sendMailPurchase', purchaserouter); 
router.use('/mockingproducts', mockingRouter);
router.use('/api/loggers', loggerRouter)

router.use("/chat",userAdminControl, (req,res)=>{
    res.render("chat")
})

router.get("/simple", (req,res)=>{
    let counter = 0
    for (let i=1; i<=100;i++){
    counter=counter+i
    }
    return res.status(200).json(counter)
})

router.get("/complex", (req,res)=>{
    let counter = 0
    for (let i=1; i<=1000000000;i++){
    counter=counter+i
    }
    return res.status(200).json(counter)
})

export default router;