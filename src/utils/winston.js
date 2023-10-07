import config from "../config/loggers/factory.js"

export default (req,res,next)=>{
    req.logger=config;
    req.logger.DEBUG(`${req.method} ${req.url} - ${new Date().toLocaleDateString()}`)
    return next();
}