import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    products: {
        type: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "products",
                },
                quantity: {
                    type: Number,
                    default: 1,
                },
                price: {
                  type: Number
              },
              total: {
                type: Number
            },
            },
        ],
        default: []
    },
    totalPrice:
    {
      type:Number
    }
});

const CartModel = mongoose.model("carts", cartSchema)

export default CartModel