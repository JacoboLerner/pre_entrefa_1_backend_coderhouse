import { Router } from "express";
import config from "../config/loggers/factory.js"

const router = Router()
router.get('/', async (req, res) => {
    config.DEBUG('Esto es un mensaje de debug');
    config.HTTP('Esto es un mensaje de http');
    config.INFO('Esto es un mensaje de info');
    config.WARN('Esto es un mensaje de warning');
    config.ERROR('Esto es un mensaje de error');
    config.FATAL('Esto es un mensaje de fatal');

    res.send('Los logs se han registrado correctamente.');
})

export default router;