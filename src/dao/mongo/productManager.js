import logger from "../../config/loggers/factory.js";
import ProductModel from "../../models/product.schema.js";


export default class ProductManager {
    #id = 1;
    constructor(path) {  

        this.path=path

    }

    getProducts = async () => {
        try{
            const products=await ProductModel.find();
            this.products = products;
            return this.products;

        }catch(e){
            logger.ERROR(e)
        }       
    }

    addProduct= async (product)=> { 
        try{
            const producto = await ProductModel.create(product)
            logger.INFO(producto)  
            return producto
        }
        catch{(e)=>{
            logger.ERROR("Hubo un error en el ingreso de datos")
        } }

        }
        getProductById = async (productId)=>{
            try{
                const product = await ProductModel.findById(productId)
    
                if(!product) return { status: 404, response: "Producto no encontrado." }
    
                return { status: 200, response: product }
            }catch(error){
                logger.error(`error: ${error}`)
            }
        }
        
        updateProduct = async (id,obj) => {
            try{
                const indexProduct = await ProductModel.findById(id)
                if(!indexProduct) return { status: 404, response: "Producto no encontrado." }
                const productData = indexProduct._doc
                console.log(productData,id,obj)
                const updatedProduct = {
                    ...productData,
                    ...obj
                }
                const walter= await ProductModel.updateOne({ _id: id }, updatedProduct)
                console.log(walter);
                return { status: 200, response: "Producto actualizado." }


            }catch(error){
                logger.ERROR(`error: ${error}`)
            }

        }
        
        deleteProductbyId=async(deleteId)=>{
            try{
                const products= await ProductModel.findByIdAndDelete(deleteId)
                return products;
    
            }catch(e){
                logger.ERROR(e)
            }      
}}
