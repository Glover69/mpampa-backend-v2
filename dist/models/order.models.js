"use strict";
// Schema structure for orders
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const ItemsSchema = new mongoose_1.Schema({
    productID: { type: String, ref: "Product", required: true },
    productName: { type: String, required: true },
    productSize: { type: String, required: true },
    productQuantity: { type: Number, required: true },
    productImage: { type: String, required: true },
    productPrice: { type: Number, required: true },
});
const ShippingAddressSchema = new mongoose_1.Schema({
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
});
const OrderSchema = new mongoose_1.Schema({
    orderID: { type: String, required: true },
    customerID: { type: String, required: true },
    items: [ItemsSchema],
    shippingAddress: [ShippingAddressSchema],
    billingAddress: [ShippingAddressSchema],
    paymentStatus: {
        type: String,
        enum: ["pending", "paid", "failed", "refunded"],
        required: true,
    },
    deliveryCost: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    discount: { type: Number, required: false },
    orderStatus: {
        type: String,
        enum: [
            "pending",
            "processing",
            "shipped",
            "delivered",
            "cancelled",
            "returned",
        ],
        required: true,
    },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
}, { collection: "website-orders" });
const OrderModel = mongoose_1.default.model("orders", OrderSchema);
exports.OrderModel = OrderModel;
