import mongoose from "mongoose";
/*[
    {
        "id": 1,
        "products": [
          {
            "id": 10,
            "qty": 3
          },
        ]
      },
      {
        "id": 2,
        "products": []
      }
    ]*/
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
            },
        ],
        default: []
    },
});

const CartModel = mongoose.model("carts", cartSchema)

export default CartModel