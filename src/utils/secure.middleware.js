import config from "../../env.js"
import bcrypt from 'bcryptjs'

const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/');
    }
};

const isAdmin = (req, res, next) => {
    if (req.user && (req.user.role === 'admin'|| req.user.role === 'premium') ){
        next();
        
    } else {
        res.status(403).json({ message: 'Acceso no autorizado.' });
    }
};

const hasAdminCredentials = (email, password) => {
    // Verificar si las credenciales coinciden con las del administrador usando ademas el dotenv
    if (email === config.adminName && password === config.adminPassword){
        return true
    }
};

const userAdminControl = (req,res,next)=>{
    if(req.session.user.email != config.adminName){
        next()
    }else{
        res.status(403).json({ message: 'Acceso no autorizado.' });
    }
    } 

const generateRandomString = (num) => {
        return [...Array(num)].map(() => {
            const randomNum = ~~(Math.random() * 36);
            return randomNum.toString(36);
        })
            .join('')
            .toUpperCase();
    }
    
const createHash = password => {
        const saltRounds = 10;
        return bcrypt.hashSync(password, saltRounds)
    }
export { isAuthenticated, isAdmin, hasAdminCredentials,userAdminControl,generateRandomString,createHash };