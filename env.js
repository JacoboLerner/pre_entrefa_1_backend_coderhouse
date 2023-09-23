import dotenv from "dotenv";

dotenv.config();

export default {
    port: process.env.PORT,
    mongoUrl: process.env.MONGO_URL,
    adminName: process.env.ADMIN_EMAIL,
    adminPassword: process.env.ADMIN_PASSWORD,
    mailDelEcommerce: process.env.NODEMAILER_USER,
    mailPasswordDelEcommerce: process.env.NODEMAILER_PASSWORD
}
