import express from "express";
import handlebars from "express-handlebars";
import productsRouter from "./routes/productsRoutes.js";
import productsViewsRouter from "./routes/productoViewsRouter.js";
import cartRouter from "./routes/cartRoutes.js";
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()
app.engine("handlebars",handlebars.engine())
app.set("views",__dirname + "/views")
app.set("view engine","handlebars")

app.get("/",(req,res)=>{
    const {nombre}=req.query
    res.render("index",{nombre:nombre})
})

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use("/assets",express.static( __dirname + "/public"));
app.use('/api/products', productsRouter);
app.use('/products', productsViewsRouter);
app.use('/api/carts', cartRouter)

app.listen(8080,()=>{
    console.log("connectados")
})