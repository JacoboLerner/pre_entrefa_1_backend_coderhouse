import config from "../../env.js"

const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/');
    }
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
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

export { isAuthenticated, isAdmin, hasAdminCredentials,userAdminControl };