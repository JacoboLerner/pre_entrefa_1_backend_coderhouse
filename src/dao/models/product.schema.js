import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"
//const {title,description,price,thumbnail,code,stock,category}= product;
const productSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        index: true,
    },
    description:{
        type: String,
        required: true,
    },
    price:{
        type: Number,
        required: true,
    },
    thumbnail:{
        type: String,
        required: true,
    },
    code:{
        type: String,
        required: true,
    },
    stock:{
        type: Number,
        required: true,
    },
    category:{
        type: String,
        required: true,
    }
});

productSchema.plugin(mongoosePaginate)
const ProductModel = mongoose.model("products", productSchema)

export default ProductModel