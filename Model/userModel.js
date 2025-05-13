import mongoose from "mongoose";
import { hash } from "bcryptjs";

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, sparse: true },
  email: { type: String, unique: true, sparse: true },
  password: { type: String, select: false }, // Ensure password is not fetched by default
  walletAddress: { type: String, unique: true, sparse: true },
  twitterurl: { type: String, sparse: true },
  website: { type: String, sparse: true },
  github: { type: String, sparse: true },
  keyword: { type: [String], default: [] },
  profile: { type: String, sparse: true },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  cart: { type: [String], sparse: true },
});

// Hash the password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await hash(this.password, 10);
  next();
});

// ✅ Correct way to define model
const User = mongoose.models.user || mongoose.model("user", UserSchema);

export default User;
