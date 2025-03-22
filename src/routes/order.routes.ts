import express from "express";
import { createOrder, getAllUsersOrders, getSpecificOrder } from "../controllers/orders.controller";


const router = express.Router()

router.post("/create", createOrder)
router.get("/all", getAllUsersOrders)
router.get("/one", getSpecificOrder)

export default router;