import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { UserModel } from "../models/user.models";
import bcrypt from "bcrypt";
import { SecretModel } from "../models/secret.models";
import { v4 as uuidv4 } from "uuid";
import { sendVerificationEmail } from "../utils/mailer";
import { authMiddleware } from "../middlewares/auth-middleware";
import crypto from "crypto"

dotenv.config();

// Login endpoint for existing users
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email: email });

    if (!user) {
      res.status(400).json({ error: "Email does't exist in our database" });
      return;
    }

    // Check password against the user's hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({ error: "Invalid password" });
      return;
    }


    const token = jwt.sign(
      { id: user.customerID, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );
    res.json({ token: token, user: { email: user.email, customerID: user.customerID }, });

  } catch (error: any) {
    console.error("Login error:", error);
    res
      .status(500)
      .json({ message: "Unable to process login at this time", error: error });
  }
};

// Sign a new user up
export const signup = async (req: Request, res: Response): Promise<void> => {
    const { email, password, firstName, lastName, phoneNumber } = req.body;

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email: email });

    if (existingUser) {
        res.status(400).json({ error: "This email already exists. Try logging in instead" });
        return
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const customerID = uuidv4();

    const otp = await sendVerificationEmail(email);
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
    await UserModel.create(userData);

    // Generate verification token
    const token = jwt.sign({ email }, process.env.JWT_SECRET!, { expiresIn: "1h" });

    res.status(201).json({
        message: "Signup successful. Please check your email for verification.",
        token: token
    });
}

// Verify OTP (For verifying user during sign up or during a password reset)
export const verifyOTP = [ async (req: Request, res: Response): Promise<void> => {
    const { otp, email, type } = req.query;

    if (!otp || !email) {
        res.status(400).json({ error: "Invalid or missing OTP/Email" });
        return
    }

    try {
        // Find the user by email
        const user = await UserModel.findOne({ email: email });
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

        if(type === 'signup'){
          // Update the user's verification status and 
          // delete otp & otpExpires fields using $unset

          await UserModel.findOneAndUpdate(
            { email: email },
            {
              $set: { "emails.0.verified": true, verified: true },
              $unset: { otp: "", otpExpires: "" }
            }
          );

          res.status(200).json({ message: "Email verified successfully!" });

        }else if(type === 'reset'){
          // This reset section is for when we're 
          // verifying otp with respect to a password reset

          // We're just sending a success message to 
          // indicate that the verification is successful

          res.status(200).json({ message: "Email verified successfully! You can move on to type your new password." });
        }

    } catch (error) {
      console.error("Error verifying OTP:", error);
      res.status(500).json({ message: "Unable to process OTP Verification at this time", error: error });
    }
}];

// Resend OTP
export const resendOTP = [
    authMiddleware, async (req: Request, res: Response): Promise<void> => {
        const { email } = req.query;

        if (!email || typeof email !== 'string') {
          res.status(400).json({ error: "Invalid email" });
          return;
        }

        try {
            // Find the user by email
            const user = await UserModel.findOne({ email: email });
            if (!user) {
              res.status(404).json({ error: "User not found" });
              return;
            }

            // Get the new code and attach it to this particular user
            const otp = await sendVerificationEmail(email);
            const otpExpires = new Date(Date.now() + 60 * 60 * 1000);

            await UserModel.findOneAndUpdate(
                { $set: { otp, otpExpires } }
            );

            res.status(200).json({ message: "OTP has been resent successfully" });

        } catch (error: any) {
            console.error("Error resending OTP:", error);
            res.status(500).json({
              status: "Failed",
              error: "An error occurred while resending the OTP. Please try again later.",
              details: error.message,
            });
        }

    }
]

// Request Password Reset
export const requestPasswordReset = async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;

    try {
      // ✅ Flow for when user just wants to change password
      const user = await UserModel.findOne({ email });

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      // Generate token to send for user verification through mail
      const otp = await sendVerificationEmail(email, "otp")
      const otpExpires = new Date(Date.now() + 60 * 60 * 1000);

      // Update user data with both otp and expiration date
      await UserModel.findOneAndUpdate(
        { email: email },
        { otp, otpExpires }
      );

      res.status(200).json({ message: "Password change request was sucessful! An OTP has been sent to your mail" });
      
  } catch (error) {
    console.error("Error requesting password reset:", error);
    res.status(500).json({ message: "Unable to process password request at this time", error: error });
  }
};

// Reset Password (After request)
export const passwordReset = async (req: Request, res: Response): Promise<void> => {
  const { customerID, newPassword, newPasswordConfirm } = req.body

  try {
    const user = await UserModel.findOne({ customerID:  customerID })
    if (!user) {
      res.status(400).json({ error: "Cannot find customer with ID: ", customerID });
      return
    }

    if(newPassword !== newPasswordConfirm){
      res.status(400).json({ message: "Password and its confirmation do not match. Please check and try again"})
    }

    user.password = await bcrypt.hash(newPassword, 10)
    await UserModel.findOneAndUpdate(
      { customerID: customerID },
      { password: user.password }
    );

    res.status(200).json({ message: "Password reset successfully" });

  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Unable to process password reset at this time", error: error });
  }
}

// Change password (For logged-in users after requesting a password )
export const changePassword = [ authMiddleware, async (req: Request, res: Response): Promise<void> => {
  const { customerID, oldPassword, newPassword } = req.body;

  try {
    const user = await UserModel.findOne({ customerID: customerID });
    if (!user) {
      res.status(400).json({ error: "Cannot find customer with ID: ", customerID });
      return
    }

    // Comparing old password with the one from the body
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch){
      res.status(400).json({ message: "Old password is incorrect" });
      return;
    }

    // Hash the new password and save it
    user.password = await bcrypt.hash(newPassword, 10);
    await UserModel.findOneAndUpdate(
      { customerID: customerID },
      { password: user.password }
    );

    res.status(200).json({ message: "Password changed successfully" });
    
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Unable to process password change at this time", error: error });
  }
}];

export const logout = (req: Request, res: Response) => {
  res.json({ message: "Logged out successfully" });
};
