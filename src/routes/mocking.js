import { Router } from "express";
import { generateProduct } from '../utils/faker.js';

const router = Router()

const products = []

router.get('/', async (req, res) => {
    for (let i = 0; i < 100; i++){
        products.push(generateProduct())
    }
    res.send(products)
})

export default router