import jwt from "jsonwebtoken";
import logger from "../config/loggers/factory.js";
import config from "../../env.js"

export const authToken =(req,res,next)=>{
    const authHeader = req.headers.authorization;
    if(!authHeader)return res.status(401).render('login')
    const token=authHeader.split(' ')[1];
    jwt.verify(token,config.privateKey,(error,credentials)=>{
        if(error)return res.status(403).send({error:"no autorizado"})
        req.user=credentials.user;
    next();
    })
}

export const generateTokenWithExpire = (user) => {
    try {
        const expiresIn = 60 * 60 * 15 * 15;
        const token = jwt.sign({user}, config.privateKey, {expiresIn: expiresIn})
        return token;
    } catch (error) {
        logger.ERROR(error);
    }
};

