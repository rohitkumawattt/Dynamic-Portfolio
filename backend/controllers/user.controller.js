import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// user registration    
export const register = async (req, res) => {
    try {
        const { fullName, email, password, confirmPassword } = req.body;
        const existingUser = await userModel.findOne({ email });
        if (!fullName || !email || !password || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
                User: {
                    fullName,
                    email
                }
            })
        }
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match",
                password: password,
                confirmPassword: confirmPassword
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new userModel({
            name: fullName,
            email,
            password: hashedPassword
        })
        await newUser.save();
        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            NewUserCreate: {
                email,
                fullName,
            }
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

// user login

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }
        const userLogin = await userModel.findOne({ email });
        if (!userLogin) {
            return res.status(400).json({
                success: false,
                message: "User not found",
                email
            })
        }
        const isPasswordValid = await bcrypt.compare(password, userLogin.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            })
        }
        const accessToken = jwt.sign({ userId: userLogin._id }, process.env.JWT_ACCESS_SECREAT, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN });
        const refreshToken = jwt.sign({ userId: userLogin._id }, process.env.JWT_REFRESH_SECREAT, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN });

        const isProduction = process.env.NODE_ENV === "production";
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: isProduction, // false in local development (HTTP), true in production (HTTPS)
            sameSite: isProduction ? "None" : "Lax", // Cross-site None in production, Lax on localhost
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            accessToken,
            refreshToken,
            user: {
                id: userLogin._id,
                fullName: userLogin.name,
                email: userLogin.email
            }
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

// referesh access token controller

export const refereshAccessToken = async (req, res) => {
    const refereshToken = req.cookies.refreshToken || req.body.refreshToken || req.headers["x-refresh-token"];
    if (!refereshToken) {
        return res.status(400).json({
            success: false,
            message: "Referesh token not found"
        })
    }

    try {
        const decoded = jwt.verify(refereshToken, process.env.JWT_REFRESH_SECREAT);

        // Generate new Access and rotated Refresh tokens
        const accessToken = jwt.sign({ userId: decoded.userId }, process.env.JWT_ACCESS_SECREAT, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN });
        const newRefreshToken = jwt.sign({ userId: decoded.userId }, process.env.JWT_REFRESH_SECREAT, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN });

        const isProduction = process.env.NODE_ENV === "production";
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "None" : "Lax",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })

        return res.status(200).json({
            success: true,
            message: "Access token refreshed successfully",
            accessToken,
            refreshToken: newRefreshToken
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Invalid referesh token",
            error: error.message
        })
    }
}

// user getMe
export const getMe = async (req, res) => {
    res.json(req.user);
}