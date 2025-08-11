import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { connectDB } from './config/db.js';
import foodRouter from './routes/foodRoute.js';
import userRouter from './routes/userRoute.js';
import 'dotenv/config';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';

//app config
const app = express();
const port = process.env.PORT || 4000; // Sửa: Dùng PORT từ environment

//middleware
app.use(express.json());
app.use(cors());

//db connection
connectDB();

// api endpoints
app.use("/api/food", foodRouter);
// Bỏ dòng này vì dùng Cloudinary
// app.use("/images", express.static("uploads"));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

app.get("/", (req, res) => {
    res.send("API is running");
});

// Chỉ listen khi chạy local, không phải trên Vercel
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => console.log(`Server is running on port http://localhost:${port}`));
}

// Export app để Vercel dùng
export default app;