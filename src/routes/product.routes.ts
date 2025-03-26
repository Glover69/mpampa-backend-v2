import express from "express";
import { allProducts, getSpecificProduct } from "../controllers/product.controller";


const router = express.Router()

router.get("/all", allProducts);
router.get("/one", getSpecificProduct);

export default router