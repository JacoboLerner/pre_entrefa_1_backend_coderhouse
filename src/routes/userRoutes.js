import { Router } from "express";
import { isAuthenticated } from "../utils/secure.middleware.js";
import UserDTO from "../dto/User.js";
import User from "../models/user.schema.js"


const userRouter = Router();


userRouter.get('/', (req, res) => {
    if (req.session.user) {
        res.redirect('/products');
    } else {
        res.render('login');
    }
});



userRouter.get('/register', (req, res) => {
    if (req.session.user) {
        res.redirect('/profile');
    } else {
        res.render('register');
    }
});

userRouter.get('/profile', isAuthenticated, (req, res) => {
    const userInfo = req.session.user
    const result = new UserDTO(userInfo);
    res.render('profile', result);
});

export default userRouter;