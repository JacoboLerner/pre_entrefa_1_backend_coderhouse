import { Router } from "express";
import { getbill } from "../controllers/MailController.js"


const purchaserouter = Router();

purchaserouter.post('/send', getbill)

export default purchaserouter;