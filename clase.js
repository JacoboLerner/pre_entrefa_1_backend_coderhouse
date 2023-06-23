import fs from "fs/promises"
const path ="./productos.json"


class ProductManager {
    #id = 1;
    constructor() {        
        this.products=[];
    }

    getProducts = async () => {
        const file = await fs.readFile(path, "utf-8");
        const products = JSON.parse(file)
        return products;
    }

    addProduct= async (product)=> { 
        try{
            const file=await fs.readFile(path,"utf-8");
            const products=JSON.parse(file);
            const {title,description,price,thumbnail,code,stock}= product;
            this.products=products
            if (products.length === 0) {
                this.#id = 1
            } else {
                this.#id = products[products.length-1].id + 1
            }
            if (!title || !description || !price || !thumbnail || !code || !stock) {
                console.log("Datos incompletos");
                return null; 
            }   
            const newProduct ={
                id:this.#id++,
                ...product,
            };
            products.push(newProduct);
            await fs.writeFile(path, JSON.stringify(products));
            return newProduct        
        }
        catch{(e)=>{
            console.log(e)
        } }

        }
        getProductById = async (productId)=>{
                const file=await fs.readFile(path,"utf-8");
                const products=JSON.parse(file);
                const product = products.find(product => product.id === productId);
                if(product){
                    console.log(product)
                    return product;
                } else{
                    console.log("El producto no existe")
                    return "El producto no existe"
                }}
        
        updateProduct = async (id,obj) => {
            const file = await fs.readFile(path,"utf-8");
            const products=JSON.parse(file);
            const indexProduct = products.findIndex(p=>p.id === id)
            if(indexProduct === -1){
                return 'Producto NO encontrado'
            }
            const productUpdate = {...products[indexProduct],...obj}
            products.splice(indexProduct,1,productUpdate)
            await fs.writeFile(path,JSON.stringify(products))
        }
        
        deleteProductbyId=async(deleteId)=>{
            try{
                const file=await fs.readFile(path,"utf-8");
                const products=JSON.parse(file);
                const nuevoProductos=products.filter(product=>product.id!= deleteId)
                await fs.writeFile(path, JSON.stringify(nuevoProductos));
                nuevoProductos=products
                return products
            }
            catch{(e)=>{console.log(e)}}
        }

}

const productManager = new ProductManager;

const leche = {
    title: 'leche',
    description: 'La Serenisima, la verdad lactea',
    price: 500,
    thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSQUpV40AZGi1a0ERze4cDqAVEFcZMvdj5uQ&usqp=CAU',
    code: 'IHwSeVHr9UlH3XANRIyE',
    stock: 40
}

const playstation = {
    title: 'PS5',
    description: 'La revolucion esta aca',
    price: 500000,
    thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxszX6ODgsUYH_hsUmMwdwI1Q271N7hXlB41W49q6Jx2dwqkSZ9176QsUKipNWTsJkJ0U&usqp=CAU',
    code: '1UNGMsz9opopRIkGPt0y', //Pon el mismo codigo que en el producto de arriba para ver el error en consola 6CanoVg64jPxh3EWvhMm 1UNGMsz9opopRIkGPt0y
    stock: 5 
}

const televisor = {
    title: 'Televisor Led 40"',
    description: 'Television LED 4K',
    price: 1000,
    thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXVEqKbbkJ3FCHpbo8H2pXhbHIC5ekGonp5A&usqp=CAU',
    code: '6CanoVg64jPxh3EWvhMm',
    stock: 10
}

await productManager.addProduct(playstation);
await productManager.addProduct(leche);
await productManager.addProduct(televisor);

console.log(await productManager.getProducts())

await productManager.getProductById(2); // Busque con un numero mayor de los productos registrados para dar el simulacro de error
await productManager.deleteProductbyId(1);
await productManager.updateProduct(4,{marca: "Argentina"})
console.log(await productManager.getProducts())
