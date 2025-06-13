import orderModel from '../models/orderModel.js';
import userModel from '../models/userModel.js';
import Stripe from 'stripe';

// if (!process.env.STRIPE_SECRET_KEY) {
//     throw new Error("❌ STRIPE_SECRET_KEY is not defined in environment variables.");
// }

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
// // Kiểm tra kết nối Stripe
// try {
//     const test = await stripe.customers.list({ limit: 1 });
//     console.log("✅ Stripe key is valid. Connected to Stripe.");
// } catch (err) {
//     console.error("❌ Stripe key is invalid or Stripe API is not reachable.");
//     console.error(err.message);
// }
const placeOrder = async (req, res) => {    
    const frontend_url = "http://localhost:5173"
    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address
        });
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, {cartData: {}});

        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.name,
                    description: item.description,
                },
                unit_amount: item.price * 100, // Convert to cents
            },
            quantity: item.quantity,
        }))
        line_items.push({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: 'Delivery Charges',
                },
                unit_amount: 200, // Delivery charge in cents
            },
            quantity: 1,
        });
        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            mode: 'payment',
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
        });
        res.json({success: true, message: "Order placed successfully", session_url: session.url});

    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    try {
        if(success==="true") {
            await orderModel.findByIdAndUpdate(orderId, {payment: true });
            res.json({ success: true, message: "Paid" });
        }
        else{
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false, message: "Not Paid" });
        }
    } catch (error) {
        console.error("Error verifying order:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}
const userOrders = async(req, res) => {
    try{
        const orders = await orderModel.find({userId: req.userId});
        res.json({success:true, data: orders});
    }catch (error) {
        console.error("Error fetching user orders:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}
// Listing order for admin panel
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({})
        res.json({success: true, data: orders});
    } catch (error) {
        log.error("Error listing orders:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}
// api for udating order status
const updateStatus = async (req, res) =>{
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, {status: req.body.status});
        res.json({success: true, message: "Order status updated successfully"});
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}
export {placeOrder, verifyOrder, userOrders, listOrders, updateStatus};
