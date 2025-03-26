// Schema structure for carts

import mongoose, { Document, Schema } from "mongoose";
import { Items } from "./order.models";

interface Cart extends Document {
    cartID: string;
    customerID: string;
    email: string;
    items: Items[];
    totalItems: number;
    subtotal: number; // Total price of all items
    totalAmount: number; // Subtotal + delivery cost
    deliveryCost: number;
    discount?: number;
    createdAt: Date;
    updatedAt: Date;
}


const CartItemsSchema = new Schema<Items>({
    productID: { type: String, ref: "Product", required: false },
    productName: { type: String, required: false },
    productSize: { type: String, required: false },
    productQuantity: { type: Number, required: false },
    productImage: { type: String, required: false },
    productPrice: { type: Number, required: false },
    itemID: { type: String, required: true },
}, { _id: false });


const CartSchema = new Schema<Cart>({
    cartID: { type: String, required: false },
    customerID: { type: String, required: false },
    email: { type: String, required: false },
    items: [CartItemsSchema],
    totalItems: { type: Number, required: false },
    subtotal: { type: Number, required: false },
    totalAmount: { type: Number, required: false },
    deliveryCost: { type: Number, required: false },
    discount: { type: Number },
}, {
    collection: "carts",
    timestamps: true,
})

// Automatically update totalItems & totalPrice before saving
CartSchema.pre("save", function (next) {
    this.totalItems = this.items.reduce((acc, item) => acc + item.productQuantity, 0);
    this.subtotal = this.items.reduce((acc, item) => acc + item.productPrice * item.productQuantity, 0);
    this.totalAmount = this.subtotal + this.deliveryCost - (this.discount || 0);
    next();
});

const CartModel = mongoose.model<Cart>("carts", CartSchema);
export { Cart, CartModel };