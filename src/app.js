import express from "express";
import handlebars from "express-handlebars";
import productsRouter from "./routes/productsRoutes.js";
import productsViewsRouter from "./routes/productoViewsRouter.js";
import cartRouter from "./routes/cartRoutes.js";
import ProductManager from "./managers/productManager.js";
const productManager = new ProductManager("./src/db/productos.json")
import { Server as SocketServer } from "socket.io";
import __dirname from "./dirname.js";

const app = express();


const appServer = app.listen(8080,()=>console.log("connectados"));

const io = new SocketServer(appServer)

app.engine("handlebars",handlebars.engine())
app.set("views",__dirname + "/views")
app.set("view engine","handlebars")

app.use('/', productsViewsRouter)
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use("/assets",express.static( __dirname + "/public"));
app.use(express.static( __dirname + "/public"))
app.use('/api/products', productsRouter);
app.use('/api/carts', cartRouter)


io.on('connection', async (socket) => {
    console.log('se conecto un cliente');
    
    io.sockets.emit('connected', (data) => {
    console.log('connected with server')
})
    io.sockets.emit('products',await productManager.getProducts())

    socket.on('new_prod', async (data) => {
      productManager.addProduct(data)
        
        io.sockets.emit('products', await productManager.getProducts())     
    })

    socket.on('delete_prod',async (data) => {
      productManager.deleteProductbyId(data.pid)

        io.sockets.emit('products',await productManager.getProducts())
    })
})