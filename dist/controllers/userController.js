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
exports.getUser = void 0;
const user_models_1 = require("../models/user.models");
const auth_middleware_1 = require("../middlewares/auth-middleware");
// Endpoint for getting a user based on their customer ID (Protected Route by middleware)
exports.getUser = [
    auth_middleware_1.authMiddleware,
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
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
            res.status(400).send(`Failed to find ${(_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.customerID}`);
        }
    }),
];
