import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../utils/cloudinary.js";
import { verifyEmail } from "../emailverify/verifyEmail.js";
import { Session } from "../models/sessionModel.js";
import { sendOTPMail } from "../emailverify/sendOTPMail.js";

// controller for user registration
export const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        if(!firstName || !lastName || !email || !password){
            return res
            .status(400)
            .json({ 
                message: "All fields are required" });
        }
        const user = await User.findOne({email})
        if(user){
            return res
            .status(400)
            .json({
                success: false,
                message: "User already exists with this email"
            })
        }
        //encrypting password
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password before saving to the database so, even if the database is compromised, the actual passwords are not exposed. This is a critical security measure to protect user data.

        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword
        })

        // Generate a JWT token for send email verification. This token will be sent to the user's email and will be used to verify their email address when they click the verification link.
        const token = jwt.sign({id:newUser._id}, process.env.SECRET_KEY , {expiresIn: "10m"});
        verifyEmail(token , email); // Send verification email.
        newUser.token = token; // Store the token in the database for later verification.

        await newUser.save();
        return res
        .status(201)
        .json({
            success: true,
            message: "User registered successfully",
            user: newUser
        });

    } catch (error) {
        console.error("Error in registerUser:", error);
        res
        .status(500)
        .json({ 
            success: false,
            message:  error.message || "Server Error"
        });
    }
};

// controller for email verification

export const verify = async(req, res) =>{
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res
            .status(400)
            .json({ 
                success: false,
                message: "Authorization token is missing or invalid" });
        }
        const token = authHeader.split(" ")[1];// Extract the token from the "Bearer <token>" format example: [Bearer, ejrnfsdkjfnskjfnwkn]
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY); // it give the id of user
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                return res
                .status(400)
                .json({ 
                    success: false,
                    message: " the registration token has expired or Verification link has expired. Please request a new one."
                });
            }
            return res
            .status(400)
            .json({ 
                success: false,
                message: "token verification failed"
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
        user.token = null; // Clear the token after successful verification
        user.isVerified = true; // Mark the user as verified
        await user.save();
        return res
        .status(200)
        .json({ 
            success: true,
            message: "Email verified successfully"
        });
    } catch (error) {
        return res
        .status(500)
        .json({
            success: false,
            message: error.message || "Server Error"
        })
        
    }
};

//controller for user re-verify email

export const reVerify = async(req, res) =>{
    try {
        const {email} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res
            .status(400)
            .json({
                success: false,
                message: "User not found with this email"
            })
        }
        const token = jwt.sign({id: user._id}, process.env.SECRET_KEY , {expiresIn: "10m"});
        verifyEmail(token , email);
        user.token = token; // Update the token in the database for later verification.
        await user.save();
        return res.status(200)
        .json({
            success: true,
            message: "Verification email sent again successfully",
            token: user.token
        })

    } catch (error) {
        return res
        .status(500)
        .json({
            success: false,
            message: error.message 
        })
    }
}

// controller for user login

export const login = async(req, res) =>{
    try {
        const {email, password} = req.body;
        if(!email || !password){
            return res
            .status(400)
            .json({
                success: false,
                message: "All fields are required"
            })
        }
        const existingUser = await User.findOne({email});
        if(!existingUser){
            return res
            .status(400)
            .json({
                success: false,
                message: "User not exists"
            })
        }

        // checking password is valid or not with old password which is stored in database.
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if(!isPasswordValid){
            return res
            .status(400)
            .json({
                success: false,
                message: "Invalid credentials"
            })
        }

        if(existingUser.isVerified === false){
            return res
            .status(400)
            .json({
                success: false,
                message: "Please verify your email before logging in"
            })
        }

        // Generate acces token and refresh token 
        const accessToken = jwt.sign({id: existingUser._id}, process.env.SECRET_KEY, {expiresIn: "10d"});

        const refreshToken = jwt.sign({id: existingUser._id}, process.env.SECRET_KEY, {expiresIn: "30d"});

        existingUser.isLoggedIn = true;
        await existingUser.save();

        // Check for existing session and delete it to prevent multiple active sessions for the same user.
        const existingSession = await Session.findOne({ userId: existingUser._id });
        if (existingSession) {
            await Session.deleteOne({ userId: existingUser._id }); // Delete existing session if it exists to prevent multiple active sessions for the same user.
        }

        // Create a new session for the logged-in user.
        await Session.create({ userId: existingUser._id }); // Create a new session for the logged-in user
        return res
        .status(200)
        .json({
            success: true,
            message: `Welcome back, ${existingUser.firstName}! You have logged in successfully.`,
            user: existingUser,
            accessToken,
            refreshToken,
            
        })
    } catch (error) {
        return res
        .status(500)
        .json({
            success: false,
            message: error.message || "Server Error"
        })
    }
}

// controller for user logout
export const logout = async(req, res) =>{
    try {
        const userId = req.id; // Assuming you have user authentication middleware that sets req.user
        await Session.deleteMany({ userId:userId }); // Delete the user's session to log them out
        await User.findByIdAndUpdate(userId, { isLoggedIn: false }); // Update the user's logged-in status in the database
        return res
        .status(200)
        .json({
            success: true,
            message: "USER Logged out successfully"
        })  
    } catch (error) {
        return res        
        .status(500)
        .json({
            success: false,
            message: error.message
        })
    }
}

// controller for frogot password 
export const forgotPassword = async(req, res) =>{
    try {
        const {email} = req.body;
        if(!email){
            return res
            .status(400)
            .json({
                success: false,
                message: "Email is required"
            })
        }
        const user = await User.findOne({email});
        if(!user){
            return res
            .status(400)
            .json({
                success: false,
                message: "User not found with this email"
            })
        }
        // Generate OTP and set expiry time for OTP (e.g., 10 minutes)
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // Set OTP expiry time to 10 minutes from now
        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await user.save();

        // Send OTP to user's email
        await sendOTPMail (otp, email); // Implement this function to send OTP email to the user
        
        return res 
        .status(200)
        .json({
            success: true,
            message: "OTP sent to email successfully",
        
        })

    } catch (error) {
        return res
        .status(500)
        .json({
            success: false,
            message: error.message
        })
    }
}

export const verifyOTP = async(req, res) =>{
    try {
        const{otp} = req.body;
        const email = req.params.email;
        if(!otp){
            return res
            .status(400)
            .json({
                success: false,
                message: "OTP is required"
            })
        }
        const user = await User.findOne({email});
        if(!user){
            return res
            .status(400)
            .json({
                success: false,
                message: "User not found with this email"
            })
        }
        if(!user.otp || !user.otpExpiry){
            return res
            .status(400)
            .json({
                success: false,
                message: "OTP is not generated or already verified"
            })
        }
        if(user.otpExpiry < new Date()){
            return res
            .status(400)
            .json({
                success: false,
                message: "OTP has expired. Please request a new one."
            })
        }
        if(otp !== user.otp){
            return res
            .status(400)
            .json({
                success: false,
                message: "Invalid OTP. Please try again."
            })
        }
        user.otp = null; // Clear the OTP after successful verification
        user.otpExpiry = null;
        await user.save();
        return res
        .status(200)
        .json({
            success: true,
            message: "OTP verified successfully. You can now reset your password."
        })
    } catch (error) {
        return res
        .status(500)
        .json({
            success: false,
            message: error.message
        })
    }
}

export const changePassword = async(req, res) =>{
    try {
        const {newPassword , confirmPassword} = req.body;
        const {email} = req.params;
        const user = await User.findOne({email});
        if(!user){
            return res
            .status(400)
            .json({
                success: false,
                message: "User not found with this email"
            })
        }
        if(!newPassword || !confirmPassword){
            return res
            .status(400)
            .json({
                success: false,
                message: "All fields are required"
            })
        }   

        if(newPassword !== confirmPassword){
            return res
            .status(400)
            .json({
                success: false,
                message: "New password and confirm password do not match"
            })
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10); // Hash the new password before saving to the database
        user.password = hashedPassword;
        await user.save();
        return res
        .status(200)
        .json({
            success: true,
            message: "Password changed successfully"
        })
    } catch (error) {   
        return res
        .status(500)
        .json({
            success: false,
            message: error.message
        })
    }
}

export const allUser = async(_, res) =>{
    try {
        const users = await User.find();
        return res
        .status(200)
        .json({
            success: true,
            users
        })

    } catch (error) {
        return res
        .status(500)
        .json({
            success: false,
            message: error.message
        })
        
    }
}

export const getUserById = async(req, res) =>{
    try {
        const {userId} = req.params; 
        const user = await User.findById(userId).select("-password -otp -otpExpiry -token "); // Exclude sensitive fields like password, otp, otpExpiry, and token from the response for security reasons.
        if(!user){
            return res
            .status(400)
            .json({
                success: false,
                message: "User not found with this id"
            })
        } 
        return res
        .status(200)
        .json({
            success: true,
            user,
        })
    } catch (error) {
        return res
        .status(500)
        .json({
            success: false,
            message: error.message
        })

    }
} 

export const updateUser = async(req, res) =>{
    try {
        const userIdToUpdate = req.params.id; // Get the user ID from the request parameters
        const loggedInUser = req.user // from Isauthenticated middleware we get the logged in user details in req.user
        const { firstName, lastName, address, city, zipCode, phoneNo, role } = req.body; // Get the updated user details from the request body
        if (loggedInUser._id.toString() !== userIdToUpdate && loggedInUser.role !== "admin") {
            return res
            .status(403)
            .json({
                success: false,
                message: "You are not authorized to update this user's details"
            })
        }
        let user = await User.findById(userIdToUpdate);
        if (!user) {
            return res
            .status(404)
            .json({
                success: false,
                message: "User not found with this id"
            })
        }
        let profilePicUrl = user.profilePic; // Default to existing profile picture URL
        let profilePicPublicId = user.profilePicPublicId; // Default to existing profile picture public ID

        // if a new file is uploded then update the profile picture
        if (req.file) {
            if (profilePicPublicId) {
                // If there is an existing profile picture, delete it from Cloudinary before uploading the new one to avoid orphaned files and manage storage efficiently.
                await cloudinary.uploader.destroy(profilePicPublicId);
            }
            const uploadResult = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: "profile_pictures" },
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    }
                );
                stream.end(req.file.buffer);
            });
            profilePicUrl = uploadResult.secure_url;
            profilePicPublicId = uploadResult.public_id;
        }

        // Update user details with new values or keep existing values if not provided in the request body
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.address = address || user.address;
        user.city = city || user.city;
        user.zipCode = zipCode || user.zipCode;
        user.phoneNo = phoneNo || user.phoneNo;
        user.role = role || user.role;
        user.profilePic = profilePicUrl;
        const updatedUser = await user.save();

        return res
        .status(200)
        .json({
            success: true,
            message: "User details updated successfully",
            user: updatedUser
        })  

    } catch (error) {
        console.error("Error in updateUser:", error);
        return res
        .status(500)
        .json({
            success: false,
            message: error.message
        })
    }
}