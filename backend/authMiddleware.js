const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 1️⃣ Check if header exists
    if (!authHeader) {
      return res.status(401).json({
        message: "Access denied. No token provided"
      });
    }

    // 2️⃣ Check correct Bearer format
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Invalid authorization format"
      });
    }

    // 3️⃣ Extract token
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Token missing"
      });
    }

    // 4️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user data to request
    req.user = decoded;

    next();

  } catch (error) {

    // Handle expired token separately
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token expired. Please login again"
      });
    }

    return res.status(401).json({
      message: "Invalid token"
    });
  }
};

module.exports = verifyToken;