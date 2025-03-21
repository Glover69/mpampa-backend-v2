"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const router = express_1.default.Router();
router.post("/login", authController_1.login);
router.post("/signup", authController_1.signup);
router.post("/verify-otp", authController_1.verifyOTP);
router.post("/resend-otp", authController_1.resendOTP);
router.post("/request-password-reset", authController_1.requestPasswordReset);
router.post("/password-reset", authController_1.passwordReset);
router.post("/change-password", authController_1.changePassword);
router.post("/logout", authController_1.logout);
exports.default = router;
