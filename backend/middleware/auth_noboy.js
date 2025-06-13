import e from "express";
import jwt from "jsonwebtoken";

const authMiddleware_nobody = (req, res, next) => {
    const { token } = req.headers;

    if (!token) {
        return res.status(401).json({ success: false, message: "Not Authorized. Please log in again." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //console.log("✅ Token verified:", decoded);

        if (decoded.id) {
            req.userId = decoded.id;
        } else if (decoded.email) {
            req.userEmail = decoded.email;
        } else {
            return res.status(400).json({ success: false, message: "Invalid token payload." });
        }

        next();
    } catch (error) {
        console.log(error);
        //console.error("❌ Error verifying token:", error);
        res.status(403).json({ success: false, message: "Invalid token." });
    }
};

export default authMiddleware_nobody;
