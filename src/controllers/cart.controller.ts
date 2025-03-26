import { Request, Response } from "express";
import { CartModel } from "../models/cart.models";
import { v4 as uuidv4 } from "uuid";



export const createCart = [
    async (req: Request, res: Response): Promise<void> => {
        try {
            const { customerID, email } = req.body; // both fields are optional

            // Create a new cart instance with provided values (or undefined if not supplied)
            const cart = new CartModel({
                cartID: `cart-${uuidv4()}`,
                customerID: customerID || "",
                email: email || "",
                items: [],
                discount: 0,
                deliveryCost: 0,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            await cart.save();

            res.status(201).json({
                message: "Cart created successfully",
                cart,
            });
        } catch (error) {
            console.error("Error creating new cart:", error);
            res.status(500).json({
                message: "Unable to process cart creation at this time",
                error: error
            });
        }
    }
];

export const getCart = [ async (req: Request, res: Response ): Promise<void> => {

    const { customerID, cartID } = req.query;

    try {
        const cart = await CartModel.findOne({ $or: [{ customerID }, { cartID }] });

        if(!cart){
            res.status(404).json({ message: "Cart not found" });
            return;
        }
    
        res.status(200).json(cart);
        
    } catch (error) {
        console.error("Error fetching cart", error);
        res.status(500).json({
            message: "Unable to process cart fetching at this time",
            error: error
        })
    }

}]

export const addToCart = [ async (req: Request, res: Response): Promise<void> => {
    const { customerID, cartID } = req.query;

    const { items } = req.body;

    if (!customerID && !cartID) {
        res.status(400).json({ message: "Missing cart identifier. Please provide customerID or cartID. "});
        return;
    }

    if(!items ){
        res.status(400).json({ message: "Missing item in request body "})
    }

    try {
        const cart = await CartModel.findOne({ $or: [{ customerID }, { cartID }] });
        if(!cart){
            res.status(404).json({ message: "Cart not found" });
            return;
        }

        // Ensure items is processed as an array and assign a unique itemID to each
        const newItems = Array.isArray(items)
            ? items.map(item => ({ ...item, itemID: `item-${uuidv4()}` }))
            : [{ ...items, itemID: `item-${uuidv4()}` }];

        cart.items.push(...newItems);
        cart.updatedAt = new Date();
        await cart.save();

        res.status(200).json({ message: "Item added to cart successfully", cart})
        
    } catch (error) {
        console.error("Error adding item to cart:", error);
        res.status(500).json({ message: "Unable to process adding item to cart at this time",  error: error});
    }
}];

export const removeItemFromCart = [ async (req: Request, res: Response): Promise<void> => {

    // This endpoint tkes a query "type" for whether you're
    // removing a particular item or all items

    const { customerID, cartID, type } = req.query;
    const { itemID } = req.body;

    if (!customerID && !cartID) {
        res.status(400).json({ message: "Missing cart identifier. Please provide customerID or cartID. "});
        return;
    }

    if(!itemID && type == 'one'){
        res.status(400).json({ message: "Missing itemID in request body "})
        return;
    }

    try {
        const cart = await CartModel.findOne({ $or: [{ customerID }, { cartID }] });

        if(!cart){
            res.status(404).json({ message: "Cart not found" });
            return;
        }

        
        if(type === 'one'){
            const itemIndex = cart.items.findIndex(item => item.itemID === itemID);

            if(itemIndex === -1){
                res.status(404).json({ message: "Item not found in cart" });
                return;
            }
    
            cart.items.splice(itemIndex, 1);
            cart.updatedAt = new Date();
            await cart.save();
    
            res.status(200).json({ message: "Item removed from cart successfully", cart})

        }else if(type === 'all'){
            cart.items = [];
            cart.updatedAt = new Date();
            await cart.save();

            res.status(200).json({ message: "All items removed from cart successfully", cart });
        }



    } catch (error) {
        console.error("Error removing item from cart:", error);
        res.status(500).json({ message: "Unable to process removing item from cart at this time",  error: error});
    }
}];

export const updateItemQuantity = [ async (req: Request, res: Response): Promise<void> => {
    // Update item quantity by +1 or -1
    const { customerID, cartID } = req.query;
    const { itemID, quantity } = req.body;

    if (!customerID && !cartID) {
        res.status(400).json({ message: "Missing cart identifier. Please provide customerID or cartID. "});
        return;
    }

    if(!itemID){
        res.status(400).json({ message: "Missing itemID in request body "})
        return;
    }

    try {
        const cart = await CartModel.findOne({ $or: [{ customerID }, { cartID }] });
        if(!cart){
            res.status(404).json({ message: "Cart not found" });
            return;
        }
        const itemIndex = cart.items.findIndex(item => item.itemID === itemID);

        if(itemIndex === -1){
            res.status(404).json({ message: "Item not found in cart" });
            return;
        }

        cart.items[itemIndex].productQuantity = quantity;
        cart.updatedAt = new Date();
        await cart.save();

        res.status(200).json({ message: "Item quantity updated successfully", cart})

    } catch (error) {
        console.error("Error updating item quantity in cart:", error);
        res.status(500).json({ message: "Unable to process updating item quantity in cart at this time",  error: error});
    }
}]


// Create order after user has paid successfully
export const completeCart = [ async ( req: Request, res: Response ): Promise<void> => {
    // Endpoint to create order after successfull checkout
    const { customerID, cartID } = req.query;
    

}]