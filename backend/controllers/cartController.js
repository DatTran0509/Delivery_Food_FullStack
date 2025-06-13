import userModel from "../models/userModel.js";

// add items to user cart
const addToCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        let cartData = await userData.cartData;

        if(!cartData[req.body.itemId])
        {
            cartData[req.body.itemId] = 1;
        }
        else
        {
            cartData[req.body.itemId] += 1;
        }
        await userModel.findByIdAndUpdate(
            req.body.userId,
            { cartData: cartData },
        );
        res.json({ success: true, message: "Item added to cart successfully"});
    } catch (error) {
        console.error("Error adding item to cart:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}
// remove items from user cart
const removeFromCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        let cartData = await userData.cartData;
        if(cartData[req.body.itemId]>0){
            cartData[req.body.itemId] -= 1;
        }
        await userModel.findByIdAndUpdate(
            req.body.userId,
            { cartData: cartData },
            { new: true } // Return the updated document
        );
        // if(cartData[req.body.itemId] <= 0) {
        //     delete cartData[req.body.itemId]; // Remove item if quantity is 0
        // }
        
        res.json({ success: true, message: "Item removed from cart successfully" });
    } catch (error) {
        console.error("Error removing item from cart:", error);
        res.json({ success: false, message: "Failed to remove item from cart" });
    }
}

// get user cart
// const getCart = async (req, res) => {
//     try {
//         let userData = await userModel.find({ userId: req.userId });
//         let cartData = await userData.cartData;
//         res.json({ success: true, cartData: cartData });
//     } catch (error) {
//         console.error("Error fetching cart data:", error);
//         res.status(500).json({ success: false, message: "Internal server error" });
//     }
// }
const getCart = async (req, res) => {
    try {
        let userData;

        if (req.userId) {
            userData = await userModel.findById(req.userId);
        } 
        else if (req.userEmail) {
            userData = await userModel.findOne({ email: req.userEmail });
        } else {
            return res.status(400).json({ success: false, message: "No user identifier found." });
        }

        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found." });
        }
        res.json({ success: true, cartData: userData.cartData});
        // res.json({ success: true, cartData: userData.cartData, validate_data: req.userEmail || req.userId, userData: userData });
    } catch (error) {
        console.error("Error fetching cart data:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export { addToCart, removeFromCart, getCart };