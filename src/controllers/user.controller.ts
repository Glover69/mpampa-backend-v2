import { Request, Response } from "express";
import { User, UserModel } from "../models/user.models";
import { authMiddleware } from "../middlewares/auth.middleware";


// Endpoint for getting a user based on their customer ID (Protected Route by middleware)
export const getUser = [
  authMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    const { customerID } = req.query;

    try {
      const customerInfo = await UserModel.findOne({ customerID: customerID });

      if (!customerInfo) {
        res.status(404).send(`Failed to find ${customerID}. User might not exist`);
        return;
      }else{
        res.status(200).send(customerInfo);
      }
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Unable to process getting user at this time", error: error });
    }
  },
];


// Endpoint to edit customer details (Undefined fields are filtered out)
export const updateUser = [
  authMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { customerID } = req.query;
      const { firstName, lastName, profilePhoto, phoneNumber } = req.body;
  
      // Build the update object dynamically
      const updateData: Partial<User> = {
        firstName,
        lastName,
        profilePhoto,
        phoneNumber,
      };
  
      // Filter out undefined or empty values
      Object.keys(updateData).forEach(
        (key) =>
          updateData[key as keyof User] === undefined || updateData[key as keyof User] === "" &&
          delete updateData[key as keyof User]
      );
  
      // Find the user by customerID and update their information
      const updatedUser = await UserModel.findOneAndUpdate(
        { customerID },
        updateData,
        { new: true }
      );
  
      if (updatedUser) {
        res.status(200).json({
          message: "User updated successfully",
          user: updatedUser,
        });
      } else {
        res.status(404).json({
          message: "User not found",
        });
      }
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Unable to process user update at this time", error: error });
    }
  },
];

// Endpoint to delete a user
export const deleteUser = [ authMiddleware, async (req: Request, res: Response): Promise<void> => {
  const { customerID } = req.query;

  try {
    // Find and delete the customer in one step
    const deletedCustomer = await UserModel.findOneAndDelete({ customerID });

    if (!deletedCustomer) {
       res.status(404).json({ message: "Customer not found" });
       return;
    }

    // Successful deletion
    res.status(200).json({
      message: "User deleted successfully",
      data: deletedCustomer,
    });

  } catch (error: any) {
    console.error("Error deleting customer:", error);
    res.status(500).json({ message: "Error processing user deletion at this time", error: error.message });
  }
}];
