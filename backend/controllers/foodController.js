import foodModel from "../models/foodModel.js";
import cloudinary from "../config/cloudinary.js";

// add food item
const addFood = async (req, res) => {
    try {
        if (!req.file) {
            return res.json({ success: false, message: "No image file provided" });
        }

        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload_stream(
            {
                resource_type: "image",
                folder: "food_delivery", // Tạo folder trên Cloudinary
            },
            async (error, result) => {
                if (error) {
                    console.log("Cloudinary upload error:", error);
                    return res.json({ success: false, message: "Image upload failed" });
                }

                // Tạo food item với URL từ Cloudinary
                const food = new foodModel({
                    name: req.body.name,
                    description: req.body.description,
                    price: req.body.price,
                    category: req.body.category,
                    image: result.secure_url // Lưu URL từ Cloudinary
                });

                try {
                    await food.save();
                    res.json({ success: true, message: "Food Added" });
                } catch (error) {
                    console.log(error);
                    res.json({ success: false, message: "Error saving food" });
                }
            }
        );

        // Pipe buffer data to Cloudinary
        result.end(req.file.buffer);

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// all food list
const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({});
        res.json({ success: true, data: foods });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// remove food item
const removeFood = async (req, res) => {
    try {
        const food = await foodModel.findById(req.body.id);
        
        if (food && food.image) {
            // Extract public_id from Cloudinary URL để xóa ảnh
            const publicId = food.image.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(`food_delivery/${publicId}`);
        }

        await foodModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Food Removed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

export { addFood, listFood, removeFood };