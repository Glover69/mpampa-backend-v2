import express from "express";
import { addToCart, completeCart, createCart, getCart, removeItemFromCart, updateItemQuantity } from "../controllers/cart.controller";


const router = express.Router();

router.post("/new", createCart)
router.get("/one", getCart)
router.post("/add-item", addToCart)
router.delete("/remove-item", removeItemFromCart)
router.put("/update-item", updateItemQuantity)
router.post("/complete", completeCart)

export default router;