"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.changePassword = exports.passwordReset = exports.requestPasswordReset = exports.resendOTP = exports.verifyOTP = exports.signup = exports.login = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_models_1 = require("../models/user.models");
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
const mailer_1 = require("../utils/mailer");
const auth_middleware_1 = require("../middlewares/auth-middleware");
dotenv_1.default.config();
// Login endpoint for existing users
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield user_models_1.UserModel.findOne({ email: email });
        if (!user) {
            res.status(400).json({ error: "Email does't exist in our database" });
            return;
        }
        // Check password against the user's hashed password
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(400).json({ error: "Invalid password" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: user.customerID, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token: token, user: { email: user.email, customerID: user.customerID }, });
    }
    catch (error) {
        console.error("Login error:", error);
        res
            .status(500)
            .json({ message: "Unable to process login at this time", error: error });
    }
});
exports.login = login;
// Sign a new user up
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, firstName, lastName, phoneNumber } = req.body;
    // Check if user already exists
    const existingUser = yield user_models_1.UserModel.findOne({ email: email });
    if (existingUser) {
        res.status(400).json({ error: "This email already exists. Try logging in instead" });
        return;
    }
    // Hash password
    const salt = yield bcrypt_1.default.genSalt(10);
    const hashedPassword = yield bcrypt_1.default.hash(password, salt);
    const customerID = (0, uuid_1.v4)();
    const otp = yield (0, mailer_1.sendVerificationEmail)(email);
    const otpExpires = new Date(Date.now() + 60 * 60 * 1000);
    // Structure for user's data
    const userData = {
        customerID,
        email,
        emails: [{
                email: email,
                verified: false
            }],
        password: hashedPassword,
        firstName,
        lastName,
        phoneNumber,
        verified: false,
        otp,
        otpExpires
    };
    // Save structure to database
    yield user_models_1.UserModel.create(userData);
    // Generate verification token
    const token = jsonwebtoken_1.default.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(201).json({
        message: "Signup successful. Please check your email for verification.",
        token: token
    });
});
exports.signup = signup;
// Verify OTP (For verifying user during sign up or during a password reset)
exports.verifyOTP = [(req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { otp, email, type } = req.query;
        if (!otp || !email) {
            res.status(400).json({ error: "Invalid or missing OTP/Email" });
            return;
        }
        try {
            // Find the user by email
            const user = yield user_models_1.UserModel.findOne({ email: email });
            if (!user) {
                res.status(404).json({ error: "User not found" });
                return;
            }
            // Check if the OTP matches and is not expired.
            const now = new Date();
            if (user.otp !== otp || !user.otpExpires || user.otpExpires < now) {
                res.status(400).json({ error: "Invalid or expired OTP" });
                return;
            }
            if (type === 'signup') {
                // Update the user's verification status and 
                // delete otp & otpExpires fields using $unset
                yield user_models_1.UserModel.findOneAndUpdate({ email: email }, {
                    $set: { "emails.0.verified": true, verified: true },
                    $unset: { otp: "", otpExpires: "" }
                });
                res.status(200).json({ message: "Email verified successfully!" });
            }
            else if (type === 'reset') {
                // This reset section is for when we're 
                // verifying otp with respect to a password reset
                // We're just sending a success message to 
                // indicate that the verification is successful
                res.status(200).json({ message: "Email verified successfully! You can move on to type your new password." });
            }
        }
        catch (error) {
            console.error("Error verifying OTP:", error);
            res.status(500).json({ message: "Unable to process OTP Verification at this time", error: error });
        }
    })];
// Resend OTP
exports.resendOTP = [
    auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { email } = req.query;
        if (!email || typeof email !== 'string') {
            res.status(400).json({ error: "Invalid email" });
            return;
        }
        try {
            // Find the user by email
            const user = yield user_models_1.UserModel.findOne({ email: email });
            if (!user) {
                res.status(404).json({ error: "User not found" });
                return;
            }
            // Get the new code and attach it to this particular user
            const otp = yield (0, mailer_1.sendVerificationEmail)(email);
            const otpExpires = new Date(Date.now() + 60 * 60 * 1000);
            yield user_models_1.UserModel.findOneAndUpdate({ $set: { otp, otpExpires } });
            res.status(200).json({ message: "OTP has been resent successfully" });
        }
        catch (error) {
            console.error("Error resending OTP:", error);
            res.status(500).json({
                status: "Failed",
                error: "An error occurred while resending the OTP. Please try again later.",
                details: error.message,
            });
        }
    })
];
// Request Password Reset
const requestPasswordReset = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        // ✅ Flow for when user just wants to change password
        const user = yield user_models_1.UserModel.findOne({ email });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        // Generate token to send for user verification through mail
        const otp = yield (0, mailer_1.sendVerificationEmail)(email, "otp");
        const otpExpires = new Date(Date.now() + 60 * 60 * 1000);
        // Update user data with both otp and expiration date
        yield user_models_1.UserModel.findOneAndUpdate({ email: email }, { otp, otpExpires });
        res.status(200).json({ message: "Password change request was sucessful! An OTP has been sent to your mail" });
    }
    catch (error) {
        console.error("Error requesting password reset:", error);
        res.status(500).json({ message: "Unable to process password request at this time", error: error });
    }
});
exports.requestPasswordReset = requestPasswordReset;
// Reset Password (After request)
const passwordReset = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { customerID, newPassword, newPasswordConfirm } = req.body;
    try {
        const user = yield user_models_1.UserModel.findOne({ customerID: customerID });
        if (!user) {
            res.status(400).json({ error: "Cannot find customer with ID: ", customerID });
            return;
        }
        if (newPassword !== newPasswordConfirm) {
            res.status(400).json({ message: "Password and its confirmation do not match. Please check and try again" });
        }
        user.password = yield bcrypt_1.default.hash(newPassword, 10);
        yield user_models_1.UserModel.findOneAndUpdate({ customerID: customerID }, { password: user.password });
        res.status(200).json({ message: "Password reset successfully" });
    }
    catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).json({ message: "Unable to process password reset at this time", error: error });
    }
});
exports.passwordReset = passwordReset;
// Change password (For logged-in users after requesting a password )
exports.changePassword = [auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { customerID, oldPassword, newPassword } = req.body;
        try {
            const user = yield user_models_1.UserModel.findOne({ customerID: customerID });
            if (!user) {
                res.status(400).json({ error: "Cannot find customer with ID: ", customerID });
                return;
            }
            // Comparing old password with the one from the body
            const isMatch = yield bcrypt_1.default.compare(oldPassword, user.password);
            if (!isMatch) {
                res.status(400).json({ message: "Old password is incorrect" });
                return;
            }
            // Hash the new password and save it
            user.password = yield bcrypt_1.default.hash(newPassword, 10);
            yield user_models_1.UserModel.findOneAndUpdate({ customerID: customerID }, { password: user.password });
            res.status(200).json({ message: "Password changed successfully" });
        }
        catch (error) {
            console.error("Error changing password:", error);
            res.status(500).json({ message: "Unable to process password change at this time", error: error });
        }
    })];
const logout = (req, res) => {
    res.json({ message: "Logged out successfully" });
};
exports.logout = logout;
