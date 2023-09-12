import config from "../../env.js"
console.log(config)

const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
};

const isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
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

export { isAuthenticated, isAdmin, hasAdminCredentials };