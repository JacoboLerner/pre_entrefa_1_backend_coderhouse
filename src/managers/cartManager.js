import fs from "fs/promises"

export default class CartManager {
    #id = 1;

    constructor(path) {
        this.carts=[];
        this.path = path;
        this.loadData();
    }      

    loadData = async()=>{
        try{
            const file=await fs.readFile(this.path, "utf-8");
            const carts= JSON.parse(file);
            this.carts=carts;

        }catch{
            console.log(`El archivo ${this.path} no existe, creando...`)
            await fs.writeFile(this.path, "[]");
            return [];
        }
    };

    async cartList(id) {
        try {
        const cart = this.carts.find( cart => cart.id === parseInt(id));
        return cart.products;
        } catch (error) {
        console.log(
            `Error al buscar su carrito: ${error}`
        );
        }
    }

    async createCart() {
        try {
        if (this.carts.length === 0) {
            this.#id = 1
        } else {
            this.#id = this.carts[this.carts.length-1].id + 1
        }
        this.carts.push({
            id: this.#id,
            products: [],
        });

        await fs.writeFile(this.path, JSON.stringify(this.carts,null,2));
        return this.carts;
        } 
        catch (error) {
        console.log(`Hubo un error al guardar su nuevo carrito: ${error}`);
        }
    }


    async addToCart(cid,prod){
        try {
            const idt = parseInt(cid);
            const cart = this.carts.find((i) => i.id == idt);
            const index = this.carts.indexOf(cart);
            if (cart !== undefined){
                const locate = this.carts[index].products.find(i => i.id == prod.id);
                const idx = this.carts[index].products.indexOf(locate);
                if (locate){
                    this.carts[index].products[idx].qty++;
                    await fs.writeFile(this.path,JSON.stringify(this.carts,null,2));
                    return this.carts
                }else{
                    prod.qty = 1;
                    this.carts[index].products.push(prod)
                    await fs.writeFile(this.path,JSON.stringify(this.carts,null,2));
                    return this.carts
                }
            }else{
                return null
            }
        } catch (error) {
            console.log('Hubo un error al añadir el articulo al carrito',error);
        }
    }



}

