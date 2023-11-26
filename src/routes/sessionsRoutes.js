import { Router } from "express";
import passport from "passport";
import UserDTO from "../dto/User.js";
import User from "../models/user.schema.js";
import nodemailer from 'nodemailer'
import UserPasswordModel from "../models/user_password.schema.js";
import  config  from "../../env.js";
import { generateRandomString,createHash, isAuthenticated } from "../utils/secure.middleware.js";
import bcrypt from 'bcryptjs'
import { generateTokenWithExpire } from "../utils/jwt.js";

const router = Router();
router.post("/register", passport.authenticate("register",{failureRedirect:"/failregister"}), async(req,res)=>{
    req.session.user=req.user;
    res.send({status:"success", message:"usuario registrado",payload:req.session.user})
})

router.get("/failregister", async (req,res)=>{
    console.log("failed strategy");
    res.send({error:"failed"})
})


router.post('/login',passport.authenticate("login",{failureRedirect:"/faillogin"}), async (req, res) => {
    const {email}=req.body;
    const user= await User.findOne({email:email})
    if(!user)return res.status(400).json({status:"error", message: 'Credenciales inválidas.' });
    const access_token=generateTokenWithExpire(user)
    req.session.user=req.user   
    const result = new UserDTO(req.user);
    res.cookie("coderCookieToken", access_token,{
        maxAge:60*60*1000,
        httpOnly:true
    }).send({ payload: result,token:access_token})

});

router.get('/logout',  (req, res) => {
    const cookie = req.cookies["coderCookieToken"];
    try{ 
        return res.status(200).clearCookie("coderCookieToken").json({ status: "success", message: "Signed out" });
    }catch(error){
        error.where = "sessionsRouter";
        res.clearCookie("coderCookieToken");
    }

});
//rutas para recuperacion u cambio de contraseñas
router.get('/forget_password', async (req, res) => {
    res.render('forget_password');
});

router.post('/forget_password', async (req, res) => {
    const email = req.body.email
    const user = await User.findOne({ email })
    if (!user) {
        return res.status(404).json({ status: 'error', error: 'User not found' });
    }
    const token = generateRandomString(16)
    await UserPasswordModel.create({ email, token })
    const mailerConfig = {
        service: 'gmail',
        auth: { user: config.mailDelEcommerce, pass: config.mailPasswordDelEcommerce }
    }
    let transporter = nodemailer.createTransport(mailerConfig)
    let message = {
        from: config.mailDelEcommerce,
        to: email,
        subject: '[Coder e-commerce API Backend] Reset your password',
        html: `<h1>[Coder e-commerce API Backend] Reset your password</h1>
        <hr>Debes resetear tu password haciendo click en el siguiente link <a href="http://localhost:${config.port}/api/sessions/verify-token/${token}" target="_blank">http://localhost:8080/api/sessions/verify-token/${token}</a>
        <hr>
        Saludos cordiales,<br>
        <b>The Coder e-commerce API Backend</b>`
    }
    try {
        await transporter.sendMail(message)
        res.json({
            status: 'success',
            message: `Email enviado con exito a ${email} para restablecer la contraseña`
        })
    } catch (err) {
        res.status(500).json({
            status: 'error',
            error: err.message
        })
    }
    }); // Restablece la password para iniciar sesión mediante un mail enviado al correo del usuario ingresado

    router.get('/verify-token/:token', async (req, res) => {
        const token = req.params.token
        const userPassword = await UserPasswordModel.findOne({
            token
        })
        if (!userPassword) {
            //si se expira lo vuelve a llevar a la pagina para renovar contraseña
            return res.render('forget_password');
        }
        const user = userPassword.email
        res.render('reset_password', {
            user
        })
    })
//para verificar nueva contraseña y asegurar que sea nueva.
    router.post('/reset_password/:user', async (req, res) => {
        try {
            const user = await User.findOne({
                email: req.params.user
            })
            const newPassword = req.body.newPassword;
            const passwordsMatch = await bcrypt.compareSync(newPassword, user.password);
            if (passwordsMatch) {
                return res.json({ status: 'error', message: 'No puedes usar la misma contraseña' });
            } 
            await User.findByIdAndUpdate(user._id, { password: createHash(newPassword) })
            res.render("password_reset",{
                message: 'Se ha creado una nueva contraseña'
            })
            await UserPasswordModel.deleteOne({
                email: req.params.user
            })

        } catch (err) {
            res.json({
                status: 'error',
                message: 'No se ha podido crear la nueva contraseña'
            })
        }
    })

router.get ("/faillogin", (req,res)=>{
    res.send({error: "Login fallado"})
})

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }),(req, res) => {} );

router.get("/githubcallback",passport.authenticate("github", {failureRedirect: "/login"}),(req, res) => {
    req.session.user=req.user;
    console.log(req.session.user)
    res.redirect("/")
});

router.delete('/:uid', async (req, res) => {
    try{
        const uid = req.params.uid;
        const userDelete= await User.findByIdAndDelete(uid)
        if(userDelete){return res.status(200).json({status:"success", message:"User deleted"})}
    }catch(e){
        res.status(502).send({ error: "true" })
        }


    
});



router.get('/premium/:uid', async (req, res) => {
    const userid = req.session.user.user._id


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

export default router;