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
exports.verifyPayment = exports.inititatePayment = exports.getSpecificOrder = exports.getAllUsersOrders = void 0;
const auth_middleware_1 = require("../middlewares/auth.middleware");
const order_models_1 = require("../models/order.models");
const paystack_service_1 = require("../services/paystack.service");
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
// Paystack Endpoints
// Endpoint to initiate payment
exports.inititatePayment = [(req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { amount, email } = req.body;
        const paymentResponse = yield paystack_service_1.PaystackService.initiateTransaction(amount, email);
        res.status(200).json(paymentResponse);
    })];
// Endpoint to verify payment
exports.verifyPayment = [(req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { reference } = req.query;
        if (!reference || typeof reference !== 'string') {
            res.status(400).json({ message: "Invalid or missing reference" });
            return;
        }
        try {
            const paymentResponse = yield paystack_service_1.PaystackService.verifyTransaction(reference);
            res.status(200).json(paymentResponse);
        }
        catch (error) {
            console.error('Error verifying payment:', error);
            res.status(500).json({
                status: false,
                message: 'An error occurred during verification.',
                error: error
            });
        }
    })];
