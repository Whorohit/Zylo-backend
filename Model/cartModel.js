import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  items: [{ type: String, sparse:true }], // Assuming NFTs are stored separately
});

// ✅ Correct way to define model
const Cart = mongoose.models.cart || mongoose.model("Cart", CartSchema);

export default Cart;
