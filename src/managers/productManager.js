import fs from "fs/promises"

export default class ProductManager {
    #id = 1;
    constructor(path) {        
        this.products=[];
        this.path=path
        this.loadData();
    }
    loadData = async()=>{
        try{
            const file=await fs.readFile(this.path, "utf-8");
            const products= JSON.parse(file);
            this.products=products;
            if (products.length === 0) {
                this.#id = 1
            } else {
                this.#id = products[products.length-1].id + 1
            }
        }catch{
            console.log(`El archivo ${this.path} no existe, creando...`)
            await fs.writeFile(this.path, "[]");
            return [];
        }
    };

    getProducts = async () => {
           return this.products;
        
    }

    addProduct= async (product)=> { 
        try{
            const {title,description,price,thumbnail,code,stock,category}= product;
            if (!title || !description || !price || !thumbnail || !code || !stock ||!category) {
                console.log("Datos incompletos");
                return null; 
            }   
            const newProduct ={
                id:this.#id++,
                status:true,
                ...product,
            };
            this.products.push(newProduct);
            await fs.writeFile(this.path, JSON.stringify(this.products,null,2));
            return newProduct        
        }
        catch{(e)=>{
            console.log(e)
        } }

        }
        getProductById = async (productId)=>{
                const product = this.products.find(product => product.id === productId);
                if(product){
                    console.log(product)
                    return product;
                } else{
                    console.log("El producto no existe")
                }}
        
        updateProduct = async (id,obj) => {
            const indexProduct = this.products.findIndex(p=>p.id == id)
            if(indexProduct === -1){
                return 'Producto NO encontrado'
            }
            const productUpdate = {...this.products[indexProduct],...obj}
            this.products.splice(indexProduct,1,productUpdate)
            await fs.writeFile(this.path,JSON.stringify(this.products,null,2))
        }
        
        deleteProductbyId=async(deleteId)=>{
            try{
                const nuevoProductos=this.products.filter(product=>product.id!= deleteId)
                await fs.writeFile(this.path, JSON.stringify(nuevoProductos,null,2));
                this.products=nuevoProductos
                return this.products
            }
            catch{(e)=>{console.log(e)}}
        }

}





