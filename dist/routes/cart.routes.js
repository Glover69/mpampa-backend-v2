"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cart_controller_1 = require("../controllers/cart.controller");
const router = express_1.default.Router();
router.post("/new", cart_controller_1.createCart);
router.get("/one", cart_controller_1.getCart);
router.post("/add-item", cart_controller_1.addToCart);
router.delete("/remove-item", cart_controller_1.removeItemFromCart);
router.put("/update-item", cart_controller_1.updateItemQuantity);
router.post("/complete", cart_controller_1.completeCart);
exports.default = router;
