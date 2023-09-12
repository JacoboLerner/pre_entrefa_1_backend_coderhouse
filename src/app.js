import express from "express";
import handlebars from "express-handlebars";
import productsRouter from "./routes/productsRoutes.js";
import cartRouter from "./routes/cartRoutes.js";
import productsViewsRouter from "./routes/productoViewsRouter.js";
import userRouter from "./routes/userRoutes.js";
import sessionsRouter from './routes/sessionsRoutes.js'
import ProductManager from "./dao/mongo/productManager.js";
const productManager = new ProductManager("./src/db/productos.json")
import { Server as SocketServer } from "socket.io";
import {Server as HTTPServer} from "http";
import __dirname from "./dirname.js";
import mongoose from "mongoose";
import messagesManagerDB from "./dao/mongo/messagesManager.js";
import cookieParser from "cookie-parser"; 
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import  config  from "../env.js";

const app = express();
const httpServer = HTTPServer(app)
const io =  new SocketServer(httpServer)

app.use(cookieParser());
app.engine("handlebars",handlebars.engine())
app.set("views",__dirname + "/views")
app.set("view engine","handlebars")
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use("/assets",express.static( __dirname + "/public"));
app.use(express.static( __dirname + "/public"))
app.use('/api/products', productsRouter);
app.use('/api/carts', cartRouter)
app.use(
  session({
    secret: "wade0609",
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: config.mongoUrl,
      dbName: "user",
      ttl: 3600,
    }),
  })
);
//Passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

const messageManager = new messagesManagerDB();
const conn= mongoose.connect(config.mongoUrl)

app.use('/',userRouter);
app.use('/products', productsViewsRouter);
app.use('/api/sessions', sessionsRouter); 


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
  socket.on("message", async (data) => {
    let user = data.user;
    let message = data.message;
    await messageManager.addMessage(user, message)
    const messages = await messageManager.getMessages();
    socket.broadcast.emit("messageLogs", messages)
})
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

})


httpServer.listen(config.port,()=>console.log("connectados en 8080"));