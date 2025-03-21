import express from "express";
import { deleteUser, getUser, updateUser } from "../controllers/userController";

const router = express.Router();
router.get("/getUser", getUser);
router.put("/update-user", updateUser);
router.delete("/delete-user", deleteUser);

export default router;