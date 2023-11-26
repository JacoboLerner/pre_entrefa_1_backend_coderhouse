import { connect } from "mongoose";

let persistence = process.env.PERSISTENCE
let mongoUrl= process.env.MONGO_URL

let dao = {};

switch (persistence) {
  case "memory":
    console.log("Memory connected");
    break;
  case "fs":
    console.log("File System connected");
    break;
  default:
    connect(mongoUrl)
      .then(() => console.log("Mongo connected"))
      .catch((err) => console.log(err));
    const { default: CartMongo } = await import("./mongo/cartManager.js");
    const { default: ProductsMongo } = await import("./mongo/productManager.js");
    dao = { Carts: CartMongo, Product: ProductsMongo};
    break;
}

export default dao;
