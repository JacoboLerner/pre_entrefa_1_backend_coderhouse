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
            console.log(e)
        }       
    }

    addProduct= async (product)=> { 
        try{
            const producto = await ProductModel.insertMany([product])
            console.log(producto)  
            return producto
        }
        catch{(e)=>{
            console.log("Hubo un error en el ingreso de datos")
        } }

        }
        getProductById = async (productId)=>{
            try{
                const product = await ProductModel.findById(productId)
    
                if(!product) return { status: 404, response: "Producto no encontrado." }
    
                return { status: 200, response: product }
            }catch(error){
                console.log(`error: ${error}`)
            }
        }
        
        updateProduct = async (id,obj) => {
            try{
                const indexProduct = await ProductModel.findById(id)
                if(!indexProduct) return { status: 404, response: "Producto no encontrado." }
                const productData = indexProduct._doc
                console.log(productData)
                const updatedProduct = {
                    ...productData,
                    ...obj
                }
                await ProductModel.updateOne({ _id: id }, updatedProduct)
    
                return { status: 200, response: "Producto actualizado." }


            }catch(error){
                console.log(`error: ${error}`)
            }

        }
        
        deleteProductbyId=async(deleteId)=>{
            try{
                const products= await ProductModel.findByIdAndDelete(deleteId)
                const listaNueva= await ProductModel.find()
                this.products = listaNueva;
                return this.products;
    
            }catch(e){
                console.log(e)
            }      
}}
