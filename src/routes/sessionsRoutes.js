import { Router } from "express";
import passport from "passport";

const router = Router();
router.post("/register", passport.authenticate("register",{failureRedirect:"/failregister"}), async(req,res)=>{
    req.session.user = {
        _id: req.user._id,
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        age: req.user.age,
        role: req.user.role
    }
    res.send({status:"success", message:"usuario registrado",payload:req.session.user})
})

router.get("/failregister", async (req,res)=>{
    console.log("failed strategy");
    res.send({error:"failed"})
})

router.post('/login',passport.authenticate("login",{failureRedirect:"/faillogin"}), async (req, res) => {

    if(!req.user)return res.status(400).json({ message: 'Credenciales inválidas.' });
    req.session.user = {
            _id: req.user._id,
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email,
            age: req.user.age,
            role: req.user.role
        }
        res.send({status: "success",payload: req.user})
});

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