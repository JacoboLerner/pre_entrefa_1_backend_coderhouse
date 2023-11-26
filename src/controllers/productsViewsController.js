//comunicacion entre controllador y capa de servicios
import logger from "../config/loggers/factory.js";
import CartModel from "../models/cart.schema.js";
import * as ProductViewsServices from "../services/ProductsViewsService.js"


export const GetAllProducts = async (req, res) => {
    const userInfo = {
        first_name: req.session.user.user.first_name,
        last_name: req.session.user.user.last_name,
        email: req.session.user.user.email,
        age: req.session.user.user.age,
    };
    console.log(userInfo);
    const products = await ProductViewsServices.GetAllProducts()
    res.render("home", {
        products,
        userInfo
    });
};

export const GetAllRealTimeProducts = async (req, res) => {
    const userInfo = {
        email: req.session.user.email,
        role: req.session.user.role,
    };
    res.render("realTimeProducts", {userInfo});
}

export const readViewsCartController = async (req, res) => {
    try {
        const id = req.params.cid
        const result = await CartModel.findById(id).lean().exec();
        if (result === null) {
            return res.status(404).json({
                status: 'error',
                error: 'Cart not found'
            });
        }
        const mailUser = req.session.user.email;
        res.render('cart', {
            cid: result._id,
            products: result.products,
            mailUser: mailUser
        });
    } catch (error) {
        logger.ERROR(error)
        res.status(500).json({
            status: 'error',
            error: error.message
        });
    }
}