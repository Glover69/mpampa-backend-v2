import { Request, Response } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { ProductModel } from "../models/product.models";


// Endpoint to get all products

export const allProducts = [ async ( req: Request, res: Response ): Promise<void> => {
    try {
        const products = await ProductModel.find();
        res.status(200).json(products);
        
    } catch (error) {
        console.error("Error getting all products:", error);
        res.status(500).json({ message: "Unable to process getting all products at this time", error: error });
    }

}]

// Endpoint to get a specific product using their ID

export const getSpecificProduct = [ async (req: Request, res: Response ): Promise<void> => {
    const { productID } = req.query;

    if(!productID){
        res.status(400).json({ message: "Please provide the product's ID." });
        return;
    }

    try {
        const product = await ProductModel.findOne({ productID: productID});

        if(!product){
            res.status(400).json({ message: `Could not find product with ID ${productID}` });
            return;
        }else{
            res.status(200).json(product);
        }

        
    } catch (error) {
        console.error("Error getting a specific product:", error);
        res.status(500).json({ message: "Unable to process getting the specific product at this time", error: error });
    }
}]