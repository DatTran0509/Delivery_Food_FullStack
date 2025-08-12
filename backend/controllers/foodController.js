import foodModel from "../models/foodModel.js";
import cloudinary from "../config/cloudinary.js";

const addFood = async (req, res) => {
    
    try {
        if (!req.file) {
            console.log("❌ No file provided");
            return res.json({ success: false, message: "No image file provided" });
        }

        if (!req.file.buffer) {
            console.log("❌ No file buffer");
            return res.json({ success: false, message: "Invalid file data" });
        }
        
        // Test Cloudinary connection first
        try {
            await cloudinary.api.ping();
        } catch (pingError) {
            console.log("❌ Cloudinary connection failed:", pingError);
            return res.json({ success: false, message: "Cloud service unavailable" });
        }

        // Upload to Cloudinary
        const uploadResult = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: "image",
                    folder: "food_delivery",
                    transformation: [
                        { width: 500, height: 500, crop: "limit" },
                        { quality: "auto" }
                    ]
                },
                (error, result) => {
                    if (error) {
                        console.log("❌ Cloudinary upload error:", error);
                        reject(error);
                    } else {

                        console.log("  - URL:", result.secure_url);
                        console.log("  - Public ID:", result.public_id);
                        resolve(result);
                    }
                }
            );
            
            uploadStream.end(req.file.buffer);
        });

        // Validate required fields
        const { name, description, price, category } = req.body;
        if (!name || !description || !price || !category) {
            console.log("❌ Missing required fields");
            return res.json({ success: false, message: "Missing required fields" });
        }

        // Create food item
        const food = new foodModel({
            name: name.trim(),
            description: description.trim(),
            price: Number(price),
            category: category.trim(),
            image: uploadResult.secure_url
        });

        console.log("🔧 Saving to database:", {
            name: food.name,
            price: food.price,
            category: food.category,
            image: food.image
        });

        await food.save();
        console.log("✅ Food save successfully");
        
        res.json({ 
            success: true, 
            message: "Food Added Successfully",
            data: {
                id: food._id,
                name: food.name,
                image: food.image
            }
        });

    } catch (error) {
        console.log("❌ Error in addFood:", error);
        res.json({ 
            success: false, 
            message: `Error: ${error.message}`,
            details: error.stack
        });
    }
};

// all food list
const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({});
        res.json({ success: true, data: foods });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching food list" });
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
                console.log("✅ Image deleted from Cloudinary");
            } catch (cloudinaryError) {
                console.log("❌ Error deleting from Cloudinary:", cloudinaryError);
            }
        }

        await foodModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Food Removed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error removing food" });
    }
};

export { addFood, listFood, removeFood };