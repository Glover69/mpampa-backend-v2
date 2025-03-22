import express from "express";
import { login, signup, verifyOTP, resendOTP, requestPasswordReset, passwordReset, changePassword, logout } from "../controllers/auth.controller";
const router = express.Router();

router.post("/login", login)
router.post("/register", signup)
router.post("/verify-otp", verifyOTP)
router.post("/resend-otp", resendOTP)
router.post("/request-password-reset", requestPasswordReset)
router.post("/password-reset", passwordReset)
router.post("/change-password", changePassword)
router.post("/logout", logout)



export default router;