import express from "express";
import { getUser, updateUser } from "../controllers/userController";

const router = express.Router();
router.get("/getUser", getUser);
router.put("/update-user", updateUser);

export default router;