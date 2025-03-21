import { Request, Response } from "express";
import { UserModel } from "../models/user.models";
import { authMiddleware } from "../middlewares/auth-middleware";


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
        res.status(400).send(`Failed to find ${req?.params?.customerID}`);
    }
  },
];
