//union entre dao y controllador, tambien para errores
import * as ProductViewsDao from "../dao/productsViewsDao.js"

export const GetAllProducts= async()=>{
    return ProductViewsDao.find()
}