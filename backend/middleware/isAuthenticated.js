import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res
            .status(400)
            .json({ 
                success: false,
                message: "Authorization token is missing or invalid"
            });
        }

        const token = authHeader.split(" ")[1]; // Extract the token from the "Bearer <token>" format example: [Bearer, ejrnfsdkjfnskjfnwkn]
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY); // it give the id of user
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                return res
                .status(400)
                .json({ 
                    success: false,
                    message: " The registration Token has expired.  "
                });
            }
            return res
            .status(400)
            .json({ 
                success: false,
                message: "Access token is missing or invalid"
            });
        }

        const user = await User.findById(decoded.id);
        if (!user) {
            return res
            .status(400)
            .json({ 
                success: false,
                message: "User not found"
            });
        }
        console.log("decoded id from token:", decoded.id);
        req.user = user; // Attach the user object to the request for use in subsequent middleware or route handlers
        req.id = user._id; // Attach the user object to the request for use in subsequent middleware or route handlers
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        return res        
        .status(500)
        .json({
            success: false, 
            message: error.message
        })
    }
}

export const isAdmin =  (req, res, next) => {
    if(req.user && req.user.role === "admin"){
        next();
    } else {
        return res
        .status(400)
        .json({
            success: false,
            message: " Access denied: Admins only. "
        })
    }
}