const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log("📌 Debug: Received Authorization Header ->", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1]; // Extract token
    console.log("📌 Debug: Extracted Token ->", token);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("📌 Debug: Decoded Token Payload ->", decoded);  // Log decoded token

        if (!decoded.userId) {
            return res.status(401).json({ success: false, message: "Invalid token: No user ID found" });
        }

        req.userId = decoded.userId; // Attach userId to request
        console.log("📌 Debug: Set req.userId ->", req.userId);
        next();
    } catch (error) {
        console.error("🔥 JWT Verification Error:", error.message);
        return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
};

module.exports = authenticate;
