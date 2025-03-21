import nodemailer from "nodemailer";
import { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

// Status to accomodate for both OTP and reset link, whilst the "token" takes the token generated from
// the request password reset endpoint is passed through that to here

export const sendVerificationEmail = async (email: string, status?: string, token?: string): Promise<string | undefined> => {

    // Nodemailer
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: Number(process.env.SMTP_PORT),
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

    if(status === "otp"){
        try {
            const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
        
            const mailOptions = {
              from: "Mpampa Cereals",
              to: email,
              subject: "Mpampa Cereals: Verification Code",
              html: `<span>Your OTP code is: <b>${otp}</b>. This expires in 1 hour.</span>`, // html body
            };
        
            await transporter.sendMail(mailOptions);
            return otp;
          } catch (error: any) {
            console.error("Error sending OTP verification code:", error);
            throw new Error("Failed to send verification code.");
          }

    }else if(status === "link"){
        try {
            const resetLink = `http://localhost:4200/reset-password?token=${token}`;
    
            const mailOptionsLink = {
                from: "Mpampa Cereals",
                to: email,
                subject: "Password Reset Request",
                html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link expires in 1 hour.</p>`,
            }

            await transporter.sendMail(mailOptionsLink);
        } catch (error) {
            console.error("Error sending reset password link:", error);
            throw new Error("Failed to send reset link.");
        }
    }
};
