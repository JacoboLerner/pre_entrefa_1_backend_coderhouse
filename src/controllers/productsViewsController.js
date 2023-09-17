//comunicacion entre controllador y capa de servicios
import * as ProductViewsServices from "../services/ProductsViewsService.js"

export const GetAllProducts = async (req, res) => {
    const userInfo = {
        first_name: req.session.user.first_name,
        last_name: req.session.user.last_name,
        email: req.session.user.email,
        age: req.session.user.age,
    };
    const products = await ProductViewsServices.GetAllProducts()
    res.render("home", {
        products,
        userInfo
    });
};

export const GetAllRealTimeProducts = async (req, res) => {
    res.render("realTimeProducts", {});
}