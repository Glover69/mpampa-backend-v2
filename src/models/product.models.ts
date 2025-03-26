import mongoose, { Document, Schema } from "mongoose";

interface Product extends Document {
  productImg: string;
  status: "Active" | "Inactive";
  subImages: string[];
  productName: string;
  ingredients: string;
  preparation: string[];
  productPrice: number;
  hasSizes: boolean;
  variations: Variations[];
  totalStock: number;
  productID: string;
  createdAt: Date;
  updatedAt: Date;
}

type Variations = {
  size: string;
  price: number;
  stock: number;
  _id: mongoose.Types.ObjectId;
};

const VariationsSchema = new Schema<Variations>({
  size: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
});

const ProductSchema = new Schema<Product>(
  {
    productImg: { type: String, required: true },
    subImages: [{ type: String }],
    status: { type: String, required: true },
    productName: { type: String, required: true },
    ingredients: { type: String, required: true },
    preparation: [{ type: String }],
    productPrice: { type: Number, required: true },
    hasSizes: { type: Boolean, default: false },
    variations: [VariationsSchema],
    productID: { type: String, required: true },
  },
  {
    collection: "products",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true
  }
);

// Virtual field to calculate totalStock dynamically from variations
ProductSchema.virtual('totalStock').get( function (this: Product) {
    return this.variations.reduce((acc, variation) => acc + variation.stock, 0);
});

const ProductModel = mongoose.model<Product>("products", ProductSchema);

export { Product, ProductModel };
