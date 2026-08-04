// Payment Service
import axiosInstance from '../lib/axios';

export interface PaymentTransaction {
  _id: string;
  userId: string;
  courseId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'successful' | 'failed' | 'cancelled';
  transactionReference: string;
  flutterwaveTransactionId?: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentResponse {
  status: 'success' | 'failed';
  message: string;
  paymentLink?: string;
  transactionReference?: string;
}

export interface VerifyPaymentResponse {
  status: 'success' | 'failed';
  message: string;
  transaction?: PaymentTransaction;
}

export const paymentService = {
  async createPayment(params: {
    courseId: string;
    amount: number;
    redirectUrl?: string;
    affiliateId?: string;
  }): Promise<CreatePaymentResponse> {
    const response = await axiosInstance.post('/api/payment/create', params);
    return response.data;
  },

  async verifyPayment(params: {
    transaction_id: string;
    tx_ref: string;
  }): Promise<VerifyPaymentResponse> {
    const response = await axiosInstance.get('/api/payment/verify', { params });
    return response.data;
  },

  async getPaymentStatus(
    txRef: string,
    transactionId?: string
  ): Promise<VerifyPaymentResponse> {
    const response = await axiosInstance.get(`/api/payment/status/${txRef}`, {
      params: transactionId ? { transaction_id: transactionId } : undefined,
    });
    return response.data;
  },

  async getTransactionHistory(): Promise<{
    status: 'success' | 'failed';
    message: string;
    transactions?: PaymentTransaction[];
  }> {
    const response = await axiosInstance.get('/api/payment/history');
    return response.data;
  },
};
