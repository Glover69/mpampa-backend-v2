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
exports.updateUser = exports.getUser = void 0;
const user_models_1 = require("../models/user.models");
const auth_middleware_1 = require("../middlewares/auth-middleware");
// Endpoint for getting a user based on their customer ID (Protected Route by middleware)
exports.getUser = [
    auth_middleware_1.authMiddleware,
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { customerID } = req.query;
        try {
            const customerInfo = yield user_models_1.UserModel.findOne({ customerID: customerID });
            if (!customerInfo) {
                res.status(404).send(`Failed to find ${customerID}. User might not exist`);
                return;
            }
            else {
                res.status(200).send(customerInfo);
            }
        }
        catch (error) {
            console.error("Get user error:", error);
            res.status(500).json({ message: "Unable to process getting user at this time", error: error });
        }
    }),
];
// Endpoint to edit customer details (Undefined fields are filtered out)
exports.updateUser = [
    auth_middleware_1.authMiddleware,
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { customerID } = req.query;
            const { firstName, lastName, profilePhoto, phoneNumber } = req.body;
            // Build the update object dynamically
            const updateData = {
                firstName,
                lastName,
                profilePhoto,
                phoneNumber,
            };
            // Filter out undefined or empty values
            Object.keys(updateData).forEach((key) => updateData[key] === undefined || updateData[key] === "" &&
                delete updateData[key]);
            // Find the user by customerID and update their information
            const updatedUser = yield user_models_1.UserModel.findOneAndUpdate({ customerID }, updateData, { new: true });
            if (updatedUser) {
                res.status(200).json({
                    message: "User updated successfully",
                    user: updatedUser,
                });
            }
            else {
                res.status(404).json({
                    message: "User not found",
                });
            }
        }
        catch (error) {
            console.error("Error updating user:", error);
            res.status(500).json({ message: "Unable to process user update at this time", error: error });
        }
    }),
];
