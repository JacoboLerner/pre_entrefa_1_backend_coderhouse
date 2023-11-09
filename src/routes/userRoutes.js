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

userRouter.get('/logout', isAuthenticated, (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err.message);
        }
        res.redirect('/');
    });
});

userRouter.get('/api/users/premium/:uid', async (req, res) => {
    const userid = req.session.user._id


    // Verificar que el rol proporcionado sea válido (usuario o premium)

    try {
        const user= await User.findById(userid)
        
        if(user.role =='usuario'){
            const updatedUser= await User.findOneAndUpdate(
                {_id:userid},
            { role: 'premium'},
            { new: true }
        );
        await updatedUser.save();
        console.log(updatedUser.role+" hola 1")
        res.render('role_cambiado', {
            message:"El usuario ahora tiene role de: " + updatedUser.role
        });
    }else if(user.role=='premium'){
        const updatedUser=await User.findOneAndUpdate(
            {_id:userid},
            { role: "usuario" },
            { new: true }
        );
        await updatedUser.save();
        console.log(updatedUser.role+" hola 2")
        res.render('role_cambiado', {
            message:"El usuario ahora tiene role de: " + updatedUser.role
        })
   
    } else{
        return res.status(400).json({ error: 'Rol no válido' });
    }


    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

export default userRouter;