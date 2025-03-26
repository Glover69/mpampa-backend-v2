// src/services/paystack.service.ts
import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file

const paystackKey = process.env.PAYSTACK_SECRET_KEY_LIVE;

if (!paystackKey) {
  console.error('Paystack Key is missing. Check your environment variables.');
  process.exit(1);
}

export class PaystackService {
  static async initiateTransaction(amount: number, email: string): Promise<any> {
    const payload = {
      email,
      amount
    };
    try {
      const response = await axios.post(
        'https://api.paystack.co/transaction/initialize',
        payload,
        {
          headers: {
            Authorization: `Bearer ${paystackKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        status: true,
        message: 'Payment initiated successfully',
        data: response.data,
      };
    } catch (error) {
      console.error('Error initiating payment:', error);
      return {
        status: false,
        message: 'Payment initiation failed',
      };
    }
  }

  static async verifyTransaction(reference: string): Promise<any> {
    try {
      const response = await axios.get(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${paystackKey}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      return {
        status: true,
        message: 'Transaction verified successfully',
        data: response.data, // Make sure to return the data from the response
      };
    } catch (error) {
      console.error('Error verifying payment:', error);
      return {
        status: false,
        message: 'Verification failed',
      };
    }
  }
}
