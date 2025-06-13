import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://greatstack:050904@cluster0.c5gmgp2.mongodb.net/food-del').then(()=>console.log("MongoDB connected successfully"));
}