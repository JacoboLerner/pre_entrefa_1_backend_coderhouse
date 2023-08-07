import express from "express";
import handlebars from "express-handlebars";
import productsRouter from "./routes/productsRoutes.js";
import productsViewsRouter from "./routes/productoViewsRouter.js";
import cartRouter from "./routes/cartRoutes.js";
import ProductManager from "./dao/mongo/productManager.js";
const productManager = new ProductManager("./src/db/productos.json")
import { Server as SocketServer } from "socket.io";
import {Server as HTTPServer} from "http";
import __dirname from "./dirname.js";
import mongoose from "mongoose";
import messagesManagerDB from "./dao/mongo/messagesManager.js";


const app = express();


const httpServer = HTTPServer(app)


const io =  new SocketServer(httpServer)

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


const messageManager = new messagesManagerDB();

const conn = mongoose.connect("mongodb+srv://jlernerrojas:0VxljIZsJgdtPPOu@codercluster.ybyhge3.mongodb.net/")

app.use((req,res,next)=>{
  req.io=io;
  next();
})

app.get("/crearNotificacion", (req,res)=>{
  res.render("join")
})
app.get("/chat", (req,res)=>{
  res.render("chat")
})
io.on('connection', async (socket) => {
  console.log('se conecto un cliente');
  const messages = await messageManager.getMessages();
  socket.emit("messageLogs", messages)
  
  socket.emit('connected', (data) => {
  console.log('connected with server')
})
  socket.emit('products',await productManager.getProducts())

  socket.on('new_prod', async (data) => {
     await productManager.addProduct(data)
      
      socket.emit('products', await productManager.getProducts())     
  })

  socket.on('delete_prod',async (data) => {
     await productManager.deleteProductbyId(data.pid)


      socket.emit('products',await productManager.getProducts())
  })

  socket.on("message", async (data) => {
    let user = data.user;
    let message = data.message;
    await messageManager.addMessage(user, message)
    const messages = await messageManager.getMessages();
    socket.emit("messageLogs", messages)
})
})



httpServer.listen(8080,()=>console.log("connectados en 8080"));