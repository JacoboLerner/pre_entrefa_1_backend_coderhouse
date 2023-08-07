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
    products: [
        {
            product: {
                type: String,
                ref: "Product",
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                default: 1,
            },
        },
    ],
});

const CartModel = mongoose.model("carts", cartSchema)

export default CartModel