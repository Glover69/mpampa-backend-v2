// Schema structure for orders

import mongoose, { Document, Schema } from "mongoose";

interface Order extends Document {
  orderID: string;
  customerID: string;
  items: Items[];
  shippingAddress: ShippingAddress[];
  billingAddress: ShippingAddress[];
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  deliveryCost: number;
  totalAmount: number;
  discount?: number; // In case a coupon is applied
  orderStatus:
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "returned";
  createdAt: Date;
  updatedAt: Date;
}

interface Items {
  productID: string;
  productName: string;
  productSize: string;
  productQuantity: number;
  productImage: string;
  productPrice: number;
}

interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

const ItemsSchema = new Schema<Items>({
  productID: { type: String, ref: "Product", required: true },
  productName: { type: String, required: true },
  productSize: { type: String, required: true },
  productQuantity: { type: Number, required: true },
  productImage: { type: String, required: true },
  productPrice: { type: Number, required: true },
});

const ShippingAddressSchema = new Schema<ShippingAddress>({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
});

const OrderSchema = new Schema<Order>(
  {
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
  },
  { collection: "website-orders" }
);

const OrderModel = mongoose.model<Order>("orders", OrderSchema);

export { Order, OrderModel };
