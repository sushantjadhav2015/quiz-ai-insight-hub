
import { Payment } from '../types';
import { delay } from './utils';
import paymentsData from '../data/payments.json';

const convertPaymentData = (payment: any): Payment => ({
  ...payment,
  createdAt: new Date(payment.createdAt),
  status: payment.status as 'pending' | 'completed' | 'failed'
});

export const processPayment = async (userId: string): Promise<Payment> => {
  await delay(1200);
  
  const payment: Payment = {
    id: (paymentsData.length + 1).toString(),
    userId,
    amount: 9.99,
    status: "completed",
    createdAt: new Date()
  };
  
  return payment;
};

export const getPaymentsByUser = async (userId: string): Promise<Payment[]> => {
  await delay(400);
  return paymentsData
    .filter(p => p.userId === userId)
    .map(convertPaymentData);
};

export const getAllPayments = async (): Promise<Payment[]> => {
  await delay(400);
  return paymentsData.map(convertPaymentData);
};
