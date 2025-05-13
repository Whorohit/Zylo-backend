import express from "express";
import Utils from "../utils/utils.js";
import User from "../Model/userModel.js";
import { addToCart, clearCart, getCart, removeFromCart } from "../controllers/cartcontoller.js";

const cartroute = express.Router();


cartroute.use(Utils.authenticateJWT);


cartroute.get("/cart",getCart)
cartroute.post("/addtocart",addToCart)

cartroute.post("/removecart",removeFromCart)
cartroute.get("/clear",clearCart)


 export default cartroute