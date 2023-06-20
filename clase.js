
class ProductManager {
    #id = 0;
    constructor() {        
        this.products = [];
    }

    getProducts = () => {
        return this.products;
    }

    addProduct(product) { 
        const {title,description,price,thumbnail,code,stock}= product;

        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.log("Datos incompletos");
            return null; 
        }

        // Verificar que el código no esté en uso
        const productWithCode = this.products.find((product) => product.code === code);
        if (productWithCode) {
            throw new Error("El código del producto ya está en uso. Revisa que no hayan productos con el mismo código e intenta nuevamente.");
        }
        const newProduct ={
            id:this.#id++,
            ...product,
        };
        this.products.push(newProduct);
    }

    getProductById(productId){
        const product = this.products.find(product => product.id === productId);
        if(!product||undefined){
            throw new Error( "NOT FOUND. Por favor, ingrese un id válido.")
        } else if(product){
            console.log ("El producto "+ product.id +"," + product.title + " fue encontrado con exito");
            return product;
        } 
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
    code: '1UNGMsz9opopRIkGPt0y', //Pon el mismo codigo que en el producto de arriba para ver el error en consola 6CanoVg64jPxh3EWvhMm
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

productManager.addProduct(playstation);
productManager.addProduct(leche);
productManager.addProduct(televisor);



productManager.getProductById(2); // Busque con un numero mayor de los productos registrados para dar el simulacro de error