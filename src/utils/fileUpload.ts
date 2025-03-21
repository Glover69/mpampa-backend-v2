import express from "express";
import { Request, Response } from "express";
import multer from "multer";
import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import * as dotenv from "dotenv";
dotenv.config();

const upload = multer();


// Configure AWS SDK
const s3 = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: "eu-north-1",
});


// New Endpoint for Image Upload
export const uploadImage = [ upload.single("photo"), async (req: Request, res: Response): Promise<void> => {
    try {
        const photo = req.file;
        if (!photo) {
            res.status(400).json({ message: "No file uploaded" });
            return;
        }
        const fileName = `${uuidv4()}-${photo.originalname}`;
        const params = {
            Bucket: "awsmpampabucket",
            Key: fileName,
            Body: photo.buffer,
        };
        const uploadResult = await s3.upload(params).promise();
        res.status(201).json({
            message: "Image uploaded successfully",
            imageUrl: uploadResult.Location,
        });
    } catch (error) {
        console.error("Error uploading image:", error);
        res.status(500).json({ message: "Error uploading image", error });
    }
}]
