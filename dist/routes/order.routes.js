"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const order_controller_1 = require("../controllers/order.controller");
const router = express_1.default.Router();
router.get("/all", order_controller_1.getAllUsersOrders);
router.get("/one", order_controller_1.getSpecificOrder);
// Paystack Endpoints
router.post("/paystack/initiate-payment", order_controller_1.inititatePayment);
router.post("/paystack/verify-payment", order_controller_1.verifyPayment);
exports.default = router;
