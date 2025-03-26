import { Request, Response } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { OrderModel } from "../models/order.models";
import { PaystackService } from "../services/paystack.service";


// Get all user's orders (takes in the customer's ID)
export const getAllUsersOrders = [ authMiddleware, async ( req: Request, res: Response ): Promise<void> => {
    const { customerID } = req.query;

    // Search for all orders in the order model with the same customer id
    try {
        const userOrders = await OrderModel.find({ customerID: customerID });
        if (!userOrders) {
            res.status(404).send(`Failed to find orders for ${customerID}.`);
            return;
        } else {
            res.status(200).send(userOrders);
        }
    } catch (error) {
        console.error("Get user orders error:", error);
        res.status(500).json({ message: "Unable to process getting user orders at this time", error: error });
    }
}]


// Get specific user order by their customer & order ID
export const getSpecificOrder = [ authMiddleware, async ( req: Request, res: Response ): Promise<void> => {
    const { orderID } = req.query

    try {
        const specificOrder = await OrderModel.find({ orderID: orderID });
        if (!specificOrder) {
            res.status(404).send(`Failed to find order ${orderID}.`);
            return;
        } else {
            res.status(200).send(specificOrder);
        }
    } catch (error) {
        console.error("Get specific order error:", error);
        res.status(500).json({ message: "Unable to process getting this specific order at this time", error: error });
    }
}]







// Paystack Endpoints

// Endpoint to initiate payment
export const inititatePayment = [ async ( req: Request, res: Response): Promise<void> => {
    const { amount, email } = req.body;
    const paymentResponse = await PaystackService.initiateTransaction(amount, email);
    res.status(200).json(paymentResponse);
}];


// Endpoint to verify payment
export const verifyPayment = [ async ( req: Request, res: Response ): Promise<void> => {
    const { reference } = req.query;

    if (!reference || typeof reference !== 'string') {
        res.status(400).json({ message: "Invalid or missing reference" });
        return;
      }

    try {
        const paymentResponse = await PaystackService.verifyTransaction(reference);
        res.status(200).json(paymentResponse);

      } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({
          status: false,
          message: 'An error occurred during verification.',
          error: error
        });
      }
}]
