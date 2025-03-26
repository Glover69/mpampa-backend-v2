import express from "express";
import { getAllUsersOrders, getSpecificOrder, inititatePayment, verifyPayment } from "../controllers/order.controller";


const router = express.Router()

router.get("/all", getAllUsersOrders)
router.get("/one", getSpecificOrder)

// Paystack Endpoints
router.post("/paystack/initiate-payment", inititatePayment)
router.post("/paystack/verify-payment", verifyPayment)

export default router;