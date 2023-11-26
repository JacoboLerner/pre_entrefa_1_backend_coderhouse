import { Router } from "express";
import { isAuthenticated } from "../utils/secure.middleware.js";
import UserDTO from "../dto/User.js";
import User from "../models/user.schema.js"
import jwt from "jsonwebtoken";

const userRouter = Router();


userRouter.get('/', (req, res) => {
    const cookie = req.cookies["coderCookieToken"];
    console.log(cookie);
    if (cookie) {
        const user = jwt.verify(cookie,process.env.PRIVATE_KEY);
        if (user) {
          req.session.user = user
          res.redirect('/products');
        }
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
    const userInfo = req.session.user.user
    const result = new UserDTO(userInfo);
    res.render('profile', result);
});

export default userRouter;