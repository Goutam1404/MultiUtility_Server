import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  sendOtp,
  verifyMail,
  userInfo,
  deleteUser,
} from "../controllers/user.controller.js";
import { useAuth } from "../middleware/user.middleware.js";

const userRouter = Router();
userRouter.post("/register", registerUser); //email, password, username
userRouter.post("/login", loginUser); //email password
userRouter.post("/logout", useAuth, logoutUser);
userRouter.post("/sendOtp", useAuth, sendOtp); //otp to user mail via req.userID
userRouter.post("/verifyMail", useAuth, verifyMail); //otp
userRouter.delete("/delete-account", useAuth, deleteUser);
userRouter.get("/user-info", useAuth, userInfo); 

export default userRouter;
