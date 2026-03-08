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
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", logoutUser);
userRouter.post("/sendOtp", useAuth, sendOtp);
userRouter.post("/verifyMail", useAuth, verifyMail);
userRouter.delete("/delete-account", useAuth, deleteUser);
userRouter.get("/user-info", useAuth, userInfo);

export default userRouter;
