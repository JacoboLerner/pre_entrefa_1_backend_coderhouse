import config from "../config/loggers/config.dev.js"


export default (error,req,res,next)=>{
    req.logger=config
    req.logger.FATAL((`${req.method}-${error.message} ${req.url} - ${new Date().toLocaleDateString()}`))
    return res.status(500).json({
        message:error.message,
        response:false
    })
}

