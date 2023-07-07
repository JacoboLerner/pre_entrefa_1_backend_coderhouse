import express from "express";
import productsRouter from "./routes/productsRoutes.js";
import cartRouter from "./routes/cartRoutes.js";

const app = express()

app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use('/api/products', productsRouter);
app.use('/api/carts', cartRouter)

app.listen(8080,()=>{
    console.log("connectados")
})