import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    const {token} = req.headers;

    if (!token) {
        return res.status(401).json({ success: false, message: "Not Authorized Login Again" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.body.userId = decoded.id; // Attach user ID to request body
        console.log("Token verified successfully:", decoded);
        next();
    } catch (error) {
        console.error("Error verifying token:", error);
        res.status(403).json({ success: false, message: "Invalid token" });
    }
}

export default authMiddleware;