import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import validator from "validator";
// login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Please fill all fields" });
    }
    try {
        const user  = await userModel.findOne({email});
        if(!user) {
            return res.status(400).json({ success: false, message: "User does not exist" });
        }
        // Check if the password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }
        
        // Create a token
        const token = createToken(user._id);
        res.json({ success: true, message: "User logged in successfully", token});
    }catch (error) {
        console.error("Error logging in user:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
}
// register user
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: "Please fill all fields" });
    }


    try {
        // Check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false,message: "User already exists" });
        }
        // Validate the email format and strong password
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Invalid email format" });
        }
        if (password.length < 6 || !/\d/.test(password) || !/[!@#$%^&*]/.test(password)) {
            return res.status(400).json({ success: false, message: "Password must be at least 6 characters long and contain a number and a special character" });
        }
        // Hash the password and create a new user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
            //isAdmin: false // Default to non-admin user
        }); 

        const user = await newUser.save();
        const token = createToken(user._id);
        // res.json({success: true, token});
        res.status(201).json({ success: true, message: "User registered successfully", token });

    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({success:false, message: "Internal server error" });
    }
}

export { loginUser, registerUser };