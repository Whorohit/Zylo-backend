import { ethers } from "ethers";
import User from '../Model/userModel.js';
import Utils from "../utils/utils.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs';


const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({ success: false, error: "Email and password are required." });
        }

        // Find user and explicitly fetch password
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(400).json({ success: false, error: "Invalid email or password." });
        }

        // Ensure user has a valid password saved
        if (!user.password) {
            return res.status(400).json({ success: false, error: "No password found for this user." });
        }

        // Compare hashed passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, error: "Invalid email or password." });
        }

        // Send JWT token
        return Utils.sendtoken(res, user, 200, "Login successful");
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};
const metlogin = async (req, res) => {
    const { walletAddress, signature } = req.body;
    console.log(req.body);
    
    if (!walletAddress || !signature) {
        return res.status(400).json({ success: false, error: "Wallet address and signature required" });
    }

    const message = `Sign in with your wallet: ${walletAddress}`;

    try {
        const recoveredAddress = ethers.verifyMessage(message, signature);
        if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
            return res.status(401).json({ success: false, error: "Signature verification failed" });
        }
  console.log(walletAddress);
  
        let user = await User.findOne({ walletAddress:walletAddress });
        console.log(user);


        if (!user) {
            user = await User.create({ walletAddress });
        }

        Utils.sendtoken(res, user, 200, "user Created successfully")

    } catch (error) {
        console.error("❌ MetaMask auth error:", error);
        res.status(400).json({ success: false, error: error.message });
    }
}
const register = async (req, res) => {
    try {
        const { email, password, username } = req.body;
        if (!email || !password || !username) {
            return res.status(400).json({ success: false, error: "Email and password are required" });
        }
        const existingUser = await User.findOne({ email }).lean();
        if (existingUser) return res.status(400).json({ success: false, error: "User already exists" });


        const newUser = await User.create({ username, email, password });


        Utils.sendtoken(res, newUser, 200, "user Created successfully")
    } catch (error) {
        console.log("Registration error:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
}
const linkwallet = async (req, res) => {
    const { walletAddress } = req.body;

    // Check if walletAddress is provided
    if (!walletAddress) {
        return res.status(400).json({ success: false, error: "Wallet address required" });
    }

    try {
        // Check if the wallet address is already linked to another user
        const existingUser = await User.findOne({ walletAddress });
        if (existingUser && existingUser._id.toString() !== req.userId) {
            return res.status(400).json({ success: false, error: "Wallet address already linked to another account" });
        }
        console.log(req);
        

        // Find the logged-in user
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        // Check if the user already linked a wallet (optional: allow update or block it)
        // if (user.walletAddress && user.walletAddress !== walletAddress) {
        //     return res.status(400).json({ success: false, error: "You already linked a wallet address" });
        // }

        // Save the new wallet address
        user.walletAddress = walletAddress;
        await user.save();

        res.json({ message: "Wallet linked successfully", walletAddress, success: true });
    } catch (error) {
        console.error("Wallet linking error:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
};

const profileinfo = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password")
        if (!user) return res.status(400).json({ success: false, error: "User not found" });

        res.status(200).json({success:true,user});
    } catch (error) {
        console.error("❌ Profile retrieval error:", error);
        res.status(400).json({ error: error.message, success: false });
    }
}


const updateProfile = async (req, res) => {
    try {
        const allowedFields = ['username', 'twitterurl', 'website', 'github', 'keyword', 'profile'];
        const updates = {};

        // Filter allowed fields from req.body
        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }

        // If an avatar is uploaded, store its filename/path
        if (req.file) {
            updates.profile = req.file.filename; // or req.file.path depending on config
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ success: false, error: "No valid fields provided for update." });
        }

        const user = await User.findByIdAndUpdate(req.userId, updates, {
            new: true,
            runValidators: true,
            select: "-password",
        });

        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        res.status(200).json({ success: true, message: "Profile updated successfully", user });
    } catch (error) {
        console.error("❌ Profile update error:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
};




export { login, profileinfo, register, linkwallet, metlogin,updateProfile }
