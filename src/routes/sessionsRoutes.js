import { Router } from "express";
import passport from "passport";
import UserDTO from "../dto/User.js";
import User from "../models/user.schema.js";
import nodemailer from 'nodemailer'
import UserPasswordModel from "../models/user_password.schema.js";
import  config  from "../../env.js";
import { generateRandomString,createHash } from "../utils/secure.middleware.js";
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

export default router;