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
exports.sendVerificationEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Status to accomodate for both OTP and reset link, whilst the "token" takes the token generated from
// the request password reset endpoint is passed through that to here
const sendVerificationEmail = (email, status, token) => __awaiter(void 0, void 0, void 0, function* () {
    // Nodemailer
    const transporter = nodemailer_1.default.createTransport({
        host: "smtp.gmail.com",
        port: Number(process.env.SMTP_PORT),
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
    if (status === "otp") {
        try {
            const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
            const mailOptions = {
                from: "Mpampa Cereals",
                to: email,
                subject: "Mpampa Cereals: Verification Code",
                html: `<span>Your OTP code is: <b>${otp}</b>. This expires in 1 hour.</span>`, // html body
            };
            yield transporter.sendMail(mailOptions);
            return otp;
        }
        catch (error) {
            console.error("Error sending OTP verification code:", error);
            throw new Error("Failed to send verification code.");
        }
    }
    else if (status === "link") {
        try {
            const resetLink = `http://localhost:4200/reset-password?token=${token}`;
            const mailOptionsLink = {
                from: "Mpampa Cereals",
                to: email,
                subject: "Password Reset Request",
                html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link expires in 1 hour.</p>`,
            };
            yield transporter.sendMail(mailOptionsLink);
        }
        catch (error) {
            console.error("Error sending reset password link:", error);
            throw new Error("Failed to send reset link.");
        }
    }
});
exports.sendVerificationEmail = sendVerificationEmail;
