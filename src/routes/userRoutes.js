import { Router } from "express";
import { isAuthenticated } from "../utils/secure.middleware.js";

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
    res.render('profile', userInfo);
});

userRouter.get('/logout', isAuthenticated, (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err.message);
        }
        res.redirect('/');
    });
});

export default userRouter;