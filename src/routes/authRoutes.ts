import express from "express";
import { login, signup, verifyOTP, logout, resendOTP, requestPasswordReset, passwordReset, changePassword } from "../controllers/authController";
const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.post("/verify-otp", verifyOTP)
router.post("/resend-otp", resendOTP)
router.post("/request-password-reset", requestPasswordReset)
router.post("/password-reset", passwordReset)
router.post("/change-password", changePassword)
router.post("/logout", logout);



export default router;