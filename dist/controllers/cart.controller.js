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
exports.completeCart = exports.updateItemQuantity = exports.removeItemFromCart = exports.addToCart = exports.getCart = exports.createCart = void 0;
const cart_models_1 = require("../models/cart.models");
const uuid_1 = require("uuid");
exports.createCart = [
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { customerID, email } = req.body; // both fields are optional
            // Create a new cart instance with provided values (or undefined if not supplied)
            const cart = new cart_models_1.CartModel({
                cartID: `cart-${(0, uuid_1.v4)()}`,
                customerID: customerID || "",
                email: email || "",
                items: [],
                discount: 0,
                deliveryCost: 0,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            yield cart.save();
            res.status(201).json({
                message: "Cart created successfully",
                cart,
            });
        }
        catch (error) {
            console.error("Error creating new cart:", error);
            res.status(500).json({
                message: "Unable to process cart creation at this time",
                error: error
            });
        }
    })
];
exports.getCart = [(req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { customerID, cartID } = req.query;
        try {
            const cart = yield cart_models_1.CartModel.findOne({ $or: [{ customerID }, { cartID }] });
            if (!cart) {
                res.status(404).json({ message: "Cart not found" });
                return;
            }
            res.status(200).json(cart);
        }
        catch (error) {
            console.error("Error fetching cart", error);
            res.status(500).json({
                message: "Unable to process cart fetching at this time",
                error: error
            });
        }
    })];
exports.addToCart = [(req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { customerID, cartID } = req.query;
        const { items } = req.body;
        if (!customerID && !cartID) {
            res.status(400).json({ message: "Missing cart identifier. Please provide customerID or cartID. " });
            return;
        }
        if (!items) {
            res.status(400).json({ message: "Missing item in request body " });
        }
        try {
            const cart = yield cart_models_1.CartModel.findOne({ $or: [{ customerID }, { cartID }] });
            if (!cart) {
                res.status(404).json({ message: "Cart not found" });
                return;
            }
            // Ensure items is processed as an array and assign a unique itemID to each
            const newItems = Array.isArray(items)
                ? items.map(item => (Object.assign(Object.assign({}, item), { itemID: `item-${(0, uuid_1.v4)()}` })))
                : [Object.assign(Object.assign({}, items), { itemID: `item-${(0, uuid_1.v4)()}` })];
            cart.items.push(...newItems);
            cart.updatedAt = new Date();
            yield cart.save();
            res.status(200).json({ message: "Item added to cart successfully", cart });
        }
        catch (error) {
            console.error("Error adding item to cart:", error);
            res.status(500).json({ message: "Unable to process adding item to cart at this time", error: error });
        }
    })];
exports.removeItemFromCart = [(req, res) => __awaiter(void 0, void 0, void 0, function* () {
        // This endpoint tkes a query "type" for whether you're
        // removing a particular item or all items
        const { customerID, cartID, type } = req.query;
        const { itemID } = req.body;
        if (!customerID && !cartID) {
            res.status(400).json({ message: "Missing cart identifier. Please provide customerID or cartID. " });
            return;
        }
        if (!itemID && type == 'one') {
            res.status(400).json({ message: "Missing itemID in request body " });
            return;
        }
        try {
            const cart = yield cart_models_1.CartModel.findOne({ $or: [{ customerID }, { cartID }] });
            if (!cart) {
                res.status(404).json({ message: "Cart not found" });
                return;
            }
            if (type === 'one') {
                const itemIndex = cart.items.findIndex(item => item.itemID === itemID);
                if (itemIndex === -1) {
                    res.status(404).json({ message: "Item not found in cart" });
                    return;
                }
                cart.items.splice(itemIndex, 1);
                cart.updatedAt = new Date();
                yield cart.save();
                res.status(200).json({ message: "Item removed from cart successfully", cart });
            }
            else if (type === 'all') {
                cart.items = [];
                cart.updatedAt = new Date();
                yield cart.save();
                res.status(200).json({ message: "All items removed from cart successfully", cart });
            }
        }
        catch (error) {
            console.error("Error removing item from cart:", error);
            res.status(500).json({ message: "Unable to process removing item from cart at this time", error: error });
        }
    })];
exports.updateItemQuantity = [(req, res) => __awaiter(void 0, void 0, void 0, function* () {
        // Update item quantity by +1 or -1
        const { customerID, cartID } = req.query;
        const { itemID, quantity } = req.body;
        if (!customerID && !cartID) {
            res.status(400).json({ message: "Missing cart identifier. Please provide customerID or cartID. " });
            return;
        }
        if (!itemID) {
            res.status(400).json({ message: "Missing itemID in request body " });
            return;
        }
        try {
            const cart = yield cart_models_1.CartModel.findOne({ $or: [{ customerID }, { cartID }] });
            if (!cart) {
                res.status(404).json({ message: "Cart not found" });
                return;
            }
            const itemIndex = cart.items.findIndex(item => item.itemID === itemID);
            if (itemIndex === -1) {
                res.status(404).json({ message: "Item not found in cart" });
                return;
            }
            cart.items[itemIndex].productQuantity = quantity;
            cart.updatedAt = new Date();
            yield cart.save();
            res.status(200).json({ message: "Item quantity updated successfully", cart });
        }
        catch (error) {
            console.error("Error updating item quantity in cart:", error);
            res.status(500).json({ message: "Unable to process updating item quantity in cart at this time", error: error });
        }
    })];
// Create order after user has paid successfully
exports.completeCart = [(req, res) => __awaiter(void 0, void 0, void 0, function* () {
        // Endpoint to create order after successfull checkout
        const { customerID, cartID } = req.query;
    })];
