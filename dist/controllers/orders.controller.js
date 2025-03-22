"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSpecificOrder = exports.getAllUsersOrders = exports.createOrder = void 0;
const auth_middleware_1 = require("../middlewares/auth.middleware");
const order_models_1 = require("../models/order.models");
// Create order after user has paid successfully
exports.createOrder = [auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        // Endpoint to create order after successfull checkout
    })];
// Get all user's orders (takes in the customer's ID)
exports.getAllUsersOrders = [auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { customerID } = req.query;
        // Search for all orders in the order model with the same customer id
        try {
            const userOrders = yield order_models_1.OrderModel.find({ customerID: customerID });
            if (!userOrders) {
                res.status(404).send(`Failed to find orders for ${customerID}.`);
                return;
            }
            else {
                res.status(200).send(userOrders);
            }
        }
        catch (error) {
            console.error("Get user orders error:", error);
            res.status(500).json({ message: "Unable to process getting user orders at this time", error: error });
        }
    })];
// Get specific user order by their customer & order ID
exports.getSpecificOrder = [auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { orderID } = req.query;
        try {
            const specificOrder = yield order_models_1.OrderModel.find({ orderID: orderID });
            if (!specificOrder) {
                res.status(404).send(`Failed to find order ${orderID}.`);
                return;
            }
            else {
                res.status(200).send(specificOrder);
            }
        }
        catch (error) {
            console.error("Get specific order error:", error);
            res.status(500).json({ message: "Unable to process getting this specific order at this time", error: error });
        }
    })];
