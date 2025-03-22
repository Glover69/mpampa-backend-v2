// ---- Auth Middleware ----
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";


export const authMiddleware = (req: any, res: any, next: any) => {
    let token = req.header("Authorization");
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    if (token.startsWith("Bearer ")) {
        token = token.slice(7).trim();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ message: "Invalid Access Token" });
    }
};