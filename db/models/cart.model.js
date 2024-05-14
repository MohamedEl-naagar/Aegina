import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
      required: true,
    },
    cartItems: [
      {
        product: { type: mongoose.Types.ObjectId, ref: "Product" },
        quantity: {
          type: Number,
          default: 1,
        },
        price: Number,
      },
    ],
    totalPrice: Number,
    totalPriceAfterDiscount: Number,
    discount: Number,
  },
  {
    timestamps: true,
  }
);

const cartModel = mongoose.model("Cart", cartSchema);
export default cartModel;
