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
exports.getSpecificProduct = exports.allProducts = void 0;
const product_models_1 = require("../models/product.models");
// Endpoint to get all products
exports.allProducts = [(req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const products = yield product_models_1.ProductModel.find();
            res.status(200).json(products);
        }
        catch (error) {
            console.error("Error getting all products:", error);
            res.status(500).json({ message: "Unable to process getting all products at this time", error: error });
        }
    })];
// Endpoint to get a specific product using their ID
exports.getSpecificProduct = [(req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { productID } = req.query;
        if (!productID) {
            res.status(400).json({ message: "Please provide the product's ID." });
            return;
        }
        try {
            const product = yield product_models_1.ProductModel.findOne({ productID: productID });
            if (!product) {
                res.status(400).json({ message: `Could not find product with ID ${productID}` });
                return;
            }
            else {
                res.status(200).json(product);
            }
        }
        catch (error) {
            console.error("Error getting a specific product:", error);
            res.status(500).json({ message: "Unable to process getting the specific product at this time", error: error });
        }
    })];
