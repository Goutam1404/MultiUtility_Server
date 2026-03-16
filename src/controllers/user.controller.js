import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import transporter from "../utils/nodemailer.js";

const signToken = (userId) => {
  return jwt.sign({userId}, process.env.JWT_SECRET, {
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
    console.log(error);
    
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

    const user = await User.findOne({ email }).select("+password");
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
    return res.status(200).json({
      success: true,
      message: "user logged in",
      userInfo: {
        name: user.username,
        email: user.email,
        isAccountVerified: user.isAccountVerified,
        isLoggedIn: user.isLoggedIn,
      },
    });
  } catch (error) {
    console.log(error);
    
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

const sendOtp = async (req, res) => {
  try {
    console.log("Sending otp");

    const user = await User.findById(req.userId);
    // console.log(req.userId);

    if (!user) {
      return res.status(400).json({
        message: "User doesn't exists",
        success: false,
      });
    }
    if (user.isAccountVerified) {
      return res.status(403).json({
        message: "User already verified",
      });
    }
    //creating OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyOtp = otp;
    user.verifyOtpExpiry = Date.now() + 15 * 60 * 1000;
    await user.save();

    //sending OTP through mail
    const mailOptions = {
      from: process.env.SENDER_MAIL,
      to: user.email,
      subject: "Account verification",
      text: `Welcome to the auth working ${user.username}, Thank you for choosing us. Your OTP is : ${otp}
            OTP expires in 15 minutes
      `,
    };
    console.log(mailOptions);
    await transporter.sendMail(mailOptions);
    return res
      .status(200)
      .json({ success: true, message: "Verification OTP sent on Email" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User verification failed",
      error: error.message,
    });
  }
};

const verifyMail = async (req, res) => {
  try {
    const { otp } = req.body;
    if (!req.userId || !otp) {
      return res.status(400).json({
        success: false,
        message: "Missing details",
      });
    }
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(400).json({
        message: "User doesn't exists",
        success: false,
      });
    }

    if (user.verifyOtp === "" || user.verifyOtp !== otp) {
      return res.status(401).json({
        success: false,
        message: "Invalid OTP",
        error: error.message,
      });
    }
    if (user.verifyOtpExpiry < Date.now()) {
      return res.status(401).json({
        success: false,
        message: "OTP expired",
        error: error.message,
      });
    }

    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpiry = 0;

    await user.save();
    const mailOptions = {
      from: process.env.SENDER_MAIL,
      to: user.email,
      subject: "Email verify success",
      text: `Welcome to the auth working ${user.username}, Thank you for choosing us.
      `,
    };
    console.log(mailOptions);
    await transporter.sendMail(mailOptions);
    return res
      .status(200)
      .json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Issue in verifying mail",
      error: error.message,
    });
  }
};
// const passwordResetOtp = async (req, res) => {};
// const passwordReset = async (req, res) => {};

const userInfo = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(400).json({
        success: true,
        message: "User not found",
      });
    }
    return res.status(200).json({
      userInfo: {
        name: user.username,
        email: user.email,
        isAccountVerified: user.isAccountVerified,
        isLoggedIn: user.isLoggedIn,
      },
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Failed to get user info",
      error: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.userId);
    if (!deletedUser) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Failed to delete user" });
  }
};

export {
  registerUser,
  loginUser,
  logoutUser,
  verifyMail,
  sendOtp,
  userInfo,
  deleteUser,
};
