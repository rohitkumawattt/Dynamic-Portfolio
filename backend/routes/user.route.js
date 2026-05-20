import express from "express"
import { register, login, getMe, refereshAccessToken } from "../controllers/user.controller.js";
import { protect } from "../middlerware/user.middleware.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.post("/refresh-access-token", refereshAccessToken);
// router.post('/send-reset-otp' , sendResetOtp);
// router.post('/reset-password' , resetPassword);


export default router;
