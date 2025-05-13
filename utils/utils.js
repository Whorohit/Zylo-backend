

import mongoose from "mongoose";
import jwt from 'jsonwebtoken'

const Utils = {
    connectDb: async () => {
        try {
            mongoose.connection.on("connected", () => console.log("Database connected"));
            await mongoose.connect(`${process.env.MONGO_URI}`);
        } catch (err) {
            console.error("Database connection failed:", err.message);
            process.exit(1); // Stop the server if DB fails
        }
    },
    sendtoken: (res, user, code, message) => {
        // Create the JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '3d' });

        // Send the token in the response body (not in cookies)
        res.status(code).json({
            success: true,
            message,
            user,
            token, // Send the token here
        });
    },
    authenticateJWT: (req, res, next) => {
        const token = req.headers['authorization']?.split(' ')[1]; // 'Bearer <token>'

        if (!token) {
            return res.status(201).json({ success:false, message: 'Unauthorized, no token provided' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            req.userId = decoded.id;; // Attach user payload to req
            next();
        } catch (err) {
            return res.status(401).json({ success:false, message: 'Unauthorized, invalid token' });
        }
    },




}



export default Utils;
