import express from "express";
import Utils from "../utils/utils.js";
import { login, metlogin, register, linkwallet, profileinfo, updateProfile } from "../controllers/authcontroller.js";
import { multersingle } from "../middleware/multer.js";
import User from "../Model/userModel.js";

const authroute = express.Router();

// ✅ Registration route
authroute.post("/register", register);

// ✅ Login User (Email/Password)
authroute.post("/login", login);

// ✅ MetaMask Login
authroute.post("/metamask-login", metlogin);

// 🔒 Protect routes after this middleware


authroute.get('/protected',Utils.authenticateJWT,async (req, res) => {
    console.log('Cookies:', req.userId);
    try {
      const user= await User.findById(req.userId).lean()
    if (!user) {
        res.status(400).json({success:false,message:"login failed"})
    }
    res.json({success:true,message: 'This is a protected route', user: user });
    } catch (error) {
      console.error("Wallet linking error:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });
authroute.use(Utils.authenticateJWT);

// ✅ Link Wallet to Existing User (Requires Auth)
authroute.post("/link-wallet", linkwallet);

// ✅ Get User Profile
authroute.get("/profile", profileinfo);

// ❗️ Unfinished route placeholder — you had /updateprofile defined
authroute.post("/updateprofile",multersingle,updateProfile);

export default authroute;
