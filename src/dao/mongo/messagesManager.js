import messageModel from "../../models/messages.schema.js";

class messagesManagerDB {
    constructor() {
        this.messagesModel = messageModel;
    }
    async addMessage(user, message) {
        try {
            const messages = await this.messagesModel.create({
                user: user,
                message: message,
            });
            return messages;
        } catch (error) {
            throw new Error("No se pudo agregar mensaje");
        }
    }
    async getMessages() {
        try {
            const messages = await this.messagesModel.find().lean();
            return messages;
        } catch (error) {
            throw new Error("No se pudo traer mensajes");
        }
    }
}
export default messagesManagerDB;