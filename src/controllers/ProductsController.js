import logger from "../config/loggers/factory.js";
import * as ProductServices from "../services/ProductsServices.js"

export const GetAllProducts = async (req, res) => {
    try{
        const { page, query, limit, order } = req.query;
        let sortBy;
        if(order === "desc") {
            sortBy = -1;
        } else if (order === "asc"){
            sortBy = 1;
        }
        let products;
        if (!query) {
            products = await ProductServices.GetAllProducts(
                {},
                {
                    limit: limit ?? 10,
                    lean: true,
                    page: page ?? 1,
                    sort: { price: sortBy },
                }
            );
        } else {
            products = await ProductServices.GetAllProducts(
                { category: query},
                {
                    limit: limit ?? 3,
                    lean: true,
                    page: page ?? 1,
                    sort: { price: sortBy },
                }
            );
        }
        res.render("products", { products, query, order });
    }catch(e){
        res.status(502).send({ error: "true,hubo un error" })
        logger.ERROR(e);
    }

    }

    export const GetProductById = async (req, res) => {
        try{
            const pid = (req.params.pid);
            const product =await ProductServices.GetOneProductById(pid)
            res.send(product);
        } catch (e){
            logger.ERROR(e)
        }
        }

    export const PostProduct = async(req,res)=>{
        try{
            const body=req.body
            const result = await ProductServices.PostNewProduct([body])
            res.status(200).send(result)
        }catch(e){
        res.status(502).send({ error: "true" })
        }
        }

    export const UpdateProductById = async(req,res)=>{
        try{
            const{pid}=req.params;
            const product=req.body
            const result=await ProductServices.UpdateProduct(pid,product)
            res.status(200).send(result)
        }catch(e){
        res.status(502).send({ error: "true" });   
        }
    }

    export const DeleteProductbyId = async (req, res) => {
        try{
            const pid = (req.params.pid);
            const product = await ProductServices.DeleteProductId(pid);
            if (product)res.status(200).send(product);
        }catch(e){
            res.status(502).send({ error: "true, producto no existe" });   
            }
        }