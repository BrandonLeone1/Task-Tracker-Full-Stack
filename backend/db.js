import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

async function connectDB () {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB")
    } catch (error) {
        console.error("Failed to connect", error)
    }
}

export default connectDB;