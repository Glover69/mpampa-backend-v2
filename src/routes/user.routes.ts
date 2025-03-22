import express from "express";
import { getUser, updateUser, deleteUser } from "../controllers/user.controller";

const router = express.Router();
router.get("/getUser", getUser);
router.put("/update-user", updateUser);
router.delete("/delete-user", deleteUser);

export default router;