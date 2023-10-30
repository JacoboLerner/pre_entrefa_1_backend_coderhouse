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
import confiig from "./config/loggers/factory.js"
import loggerRouter from "./routes/loggerRoutes.js"
import cluster from "cluster";
import { cpus } from "os";
import ProductModel from "./models/product.schema.js";
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUiExpress from 'swagger-ui-express'
import { isAuthenticated } from "./utils/secure.middleware.js";

const numberOfProcess = cpus().length
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

app.use(winston)
const messageManager = new messagesManagerDB();
const conn= mongoose.connect(config.mongoUrl)

const swaggerOptions = {
  definition: {
    openapi: '3.0.1',
    info: {
      title: 'Documentación de la API del Ecommerce',
      description: 'Proyecto Coderhouse 2022'
    }
  },
  apis: [`${ __dirname}/docs/*.yaml`]
};

const specs = swaggerJSDoc(swaggerOptions)
app.use('/docs',isAuthenticated,swaggerUiExpress.serve, swaggerUiExpress.setup(specs))


app.use('/',userRouter);
app.use('/api/carts', cartRouter)
app.use('/api/products', productsRouter);
app.use('/products', productsViewsRouter);
app.use('/api/sessions', sessionsRouter); 
app.use('/sendMailPurchase', purchaserouter); 
app.use('/mockingproducts', mockingRouter);
//nuevo desafio de loggers
app.use('/api/loggers', loggerRouter)

app.use("/chat",userAdminControl, (req,res)=>{
  res.render("chat")
})

app.get("/simple", (req,res)=>{
  let counter = 0
  for (let i=1; i<=100;i++){
    counter=counter+i
  }
  return res.status(200).json(counter)
})

app.get("/complex", (req,res)=>{
  let counter = 0
  for (let i=1; i<=1000000000;i++){
    counter=counter+i
  }
  return res.status(200).json(counter)
})

app.use((req,res,next)=>{
  req.io=io;
  next();
})

app.get("/crearNotificacion", (req,res)=>{
  res.render("join")
})

io.on('connection', async (socket) => {
  //se cva integrando en distintos lugares
  confiig.INFO('se conecto un cliente');
  const messages = await messageManager.getMessages();
  socket.emit("messageLogs", messages)
  socket.on("message", async (data) => {
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
//se cambia logica para que el usuario premium pueda eliminar solo los productos que agrego, y que admin pueda borrar todo.
  socket.on('delete_prod',async (data) => {
    console.log(data.pid)
      const prod = await ProductModel.findById(data.pid)
      const userInfo = {
        email: data.userEmail,
        role: data.userRole,
      };
      if (prod.owner == userInfo.email || userInfo.role == 'admin'){
        await productManager.deleteProductbyId(data.pid)
        socket.emit('products',await productManager.getProducts())

      }else{
        return console.error({ error: 'No puedes eliminar este producto' })
      }
  

  })

})

app.use(ErrorHandler);
//applicando clusters
if(cluster.isPrimary){
  console.log("primary");
  for ( let i=1; i<=numberOfProcess; i++){
    cluster.fork()
  }
}else{
  console.log("worker",process.pid)
  httpServer.listen(config.port,()=>console.log(`connectados en ${config.port}`));
}

//httpServer.listen(config.port,()=>console.log(`connectados en ${config.port}`));