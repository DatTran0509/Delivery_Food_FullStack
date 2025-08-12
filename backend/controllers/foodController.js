import foodModel from "../models/foodModel.js";
import cloudinary from "../config/cloudinary.js";

// add food item
const addFood = async (req, res) => {
    try {
        if (!req.file) {
            return res.json({ success: false, message: "No image file provided" });
        }

        // Upload image to Cloudinary với Promise thay vì callback
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: "image",
                folder: "food_delivery",
            }
        );

        uploadStream.on('result', async (result) => {
            try {
                const food = new foodModel({
                    name: req.body.name,
                    description: req.body.description,
                    price: req.body.price,
                    category: req.body.category,
                    image: result.secure_url
                });

                await food.save();
                res.json({ success: true, message: "Food Added" });
            } catch (error) {
                console.log(error);
                res.json({ success: false, message: "Error saving food" });
            }
        });

        uploadStream.on('error', (error) => {
            console.log("Cloudinary upload error:", error);
            res.json({ success: false, message: "Image upload failed" });
        });

        uploadStream.end(req.file.buffer);

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
            // Extract public_id from Cloudinary URL
            const urlParts = food.image.split('/');
            const publicIdWithExtension = urlParts[urlParts.length - 1];
            const publicId = `food_delivery/${publicIdWithExtension.split('.')[0]}`;
            
            try {
                await cloudinary.uploader.destroy(publicId);
            } catch (cloudinaryError) {
                console.log("Error deleting from Cloudinary:", cloudinaryError);
            }
        }

        await foodModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Food Removed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

export { addFood, listFood, removeFood };