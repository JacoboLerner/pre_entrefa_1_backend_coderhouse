import express from "express";
import productsRouter from "./routes/productsRoutes.js";
import cartRouter from "./routes/cartRoutes.js";
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express()

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use("/assets",express.static( __dirname + "/public"));
app.use('/api/products', productsRouter);
app.use('/api/carts', cartRouter)

app.listen(8080,()=>{
    console.log("connectados")
})