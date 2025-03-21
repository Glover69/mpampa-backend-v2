import express from "express";
import { uploadImage } from "../utils/fileUpload";

const router = express.Router();
router.post("/upload-image", uploadImage);

export default router;