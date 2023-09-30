import EErrors from "../error/invalid.js"

export default (error, req, res, next) => {
    console.log(error.cause)
    switch(error.code) {
        case EErrors.INVALID_TYPES_ERROR:
            res.status(500).send({ status: 'error', error: error.name, cause: error.cause });
            break
        default:
            res.send({ status: true, error: 'Unhandled error' })
    }
}