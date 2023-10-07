import EErrors from "../error/invalid.js"
import config from "../config/loggers/factory.js"

export default (error, req, res, next) => {
    req.logger = config;
    switch(error.code) {
        case EErrors.INVALID_TYPES_ERROR:
            req.logger.FATAL((`${req.method}-${error.message} ${req.url} - ${new Date().toLocaleDateString()}`))
            return res.status(500).json({
                message:error.message,
                success: false,
            })
        default:
            res.send({ status: true, error: 'Unhandled error' })
    }
}