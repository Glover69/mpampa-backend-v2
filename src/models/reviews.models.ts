// Schema structure for reviews

import mongoose, { Document, Schema } from 'mongoose';

interface Reviews extends Document {
    ratingValue: number;
    reviewMessage : string;
    reviewTitle : string;
    reviewerName : string;
    reviewType : string;
    photo: string;
    reviewId: any;
    dateCreated: Date;
    profileImage: string;
    productId?: string; // Optional field to store the product ID when reviewType is 'Products'
}


const reviewsSchema = new Schema<Reviews>({
  reviewerName: { type: String, required: true },
  reviewId: { type: String, required: false },
  reviewType: { type: String, required: false },
  photo: { type: String, required: false },
  reviewTitle: { type: String, required: true },
  reviewMessage: { type: String, required: true },
  ratingValue: { type: Number, required: true },
  profileImage: { type: String, required: false },
  dateCreated: { type: Date, required: true, default: Date.now() }, // Automatically sets the current date
  productId: { type: String, required: false }, // Optional field to link a review to a specific product
}, { collection: 'reviews' });

const reviewsModel = mongoose.model<Reviews & Document>('reviews', reviewsSchema);

export { Reviews, reviewsModel };
