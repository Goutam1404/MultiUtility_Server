import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import transporter from "../utils/nodemailer.js";
const signToken = (userId) => {
  return jwt.sign(userId, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const isUser = await User.findOne({ email });
    if (isUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }
    const user = await User.create({ username, email, password });
    await user.save();

    return res.status(200).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in registering the user",
      error: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(409).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User dosen't exists",
      });
    }
    //password check
    const isPassword = await user.isPasswordCorrect(password);
    if (!isPassword) {
      return res.status(401).json({
        success: false,
        message: "Password not correct",
      });
    }

    const token = signToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
    user.isLoggedIn = true;
    await user.save();
    return res.stat;
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Failed to login the user",
      error: error.message,
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token");
    await User.findByIdAndUpdate(req.userId, {
      isLoggedIn: false,
    });
    return res.status(200).json({
      success: true,
      message: "User logged out.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error in logging out.",
      error: error.message,
    });
  }
};

const verifyEmail = async (req, res) => {

};
const verifyEmailOtp = async (req, res) => {};
const passwordResetOtp = async (req, res) => {};
const passwordReset = async (req, res) => {};

export {registerUser, loginUser, logoutUser, verifyEmail}