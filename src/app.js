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
import purchaserouter from "./routes/mailPurchaseRoutes.js";
import { userAdminControl } from "./utils/secure.middleware.js";
import mockingRouter from "./routes/mocking.js"
import ErrorHandler from "./utils/errorMiddleware.js"
import winston from "./utils/winston.js"
import errorHandler from "./utils/errorHandler.js";

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

app.get("/api/test", (req,res)=>{
  return res.status(200).json({
    message:"logger HTTP",
    response:true
  })
})
app.use(winston)

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

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

const messageManager = new messagesManagerDB();
const conn= mongoose.connect(config.mongoUrl)

app.use('/',userRouter);
app.use('/api/carts', cartRouter)
app.use('/api/products', productsRouter);
app.use('/products', productsViewsRouter);
app.use('/api/sessions', sessionsRouter); 
app.use('/sendMailPurchase', purchaserouter); 
app.use('/mockingproducts', mockingRouter);

app.get("/chat",userAdminControl, (req,res)=>{
  res.render("chat")
})

app.use((req,res,next)=>{
  req.io=io;
  next();
})

app.get("/crearNotificacion", (req,res)=>{
  res.render("join")
})

io.on('connection', async (socket) => {
  console.log('se conecto un cliente');
  const messages = await messageManager.getMessages();
  socket.emit("messageLogs", messages)
  socket.on("message", async (data) => {
    console.log(data)
    let user = data.user;
    let message = data.message;
    await messageManager.addMessage(user, message)
    const messages = await messageManager.getMessages();
    socket.broadcast.emit("messageLogs", messages)
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

app.use(errorHandler)
app.use(ErrorHandler);

httpServer.listen(config.port,()=>console.log("connectados en 8080"));