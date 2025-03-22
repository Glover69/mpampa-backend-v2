"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const router = express_1.default.Router();
router.post("/login", auth_controller_1.login);
router.post("/register", auth_controller_1.signup);
router.post("/verify-otp", auth_controller_1.verifyOTP);
router.post("/resend-otp", auth_controller_1.resendOTP);
router.post("/request-password-reset", auth_controller_1.requestPasswordReset);
router.post("/password-reset", auth_controller_1.passwordReset);
router.post("/change-password", auth_controller_1.changePassword);
router.post("/logout", auth_controller_1.logout);
exports.default = router;
