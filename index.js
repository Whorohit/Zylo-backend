import express from 'express';
import dotenv from 'dotenv';;
import { ethers } from "ethers";
import  cors from 'cors'
import Utils from './utils/utils.js';
import authroute from './route/authroute.js';
import cartroute from './route/cartroute.js';

dotenv.config();
const app = express();
app.use(express.json());
app.use(
    cors({
      origin: "*", // 🔥 Allow any origin
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true, // Allow cookies/auth headers
    })
  );

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    console.error("❌ JWT_SECRET is missing from environment variables");
    process.exit(1);
}

Utils.connectDb();

// User Schema

app.get("/",(req, res) => res.send("Express on  bro  Vercel"))


// Function to Generate a JWT Token

app.use('/api/user', authroute);

app.use("/api/cart",cartroute)
// Middleware to verify JWT



app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
