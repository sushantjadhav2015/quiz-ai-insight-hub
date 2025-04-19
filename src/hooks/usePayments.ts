
import { useMutation, useQuery } from '@tanstack/react-query';
import { processPayment as processPaymentApi } from '../api';
import { Payment } from '../types';
import { toast } from './use-toast';

export const usePayments = (userId: string | undefined) => {
  const { data: payments = [] } = useQuery({
    queryKey: ['payments'],
    queryFn: () => Promise.resolve([]) as Promise<Payment[]>,
    staleTime: 60000,
  });

  const paymentMutation = useMutation({
    mutationFn: () => {
      if (!userId) {
        throw new Error('User not authenticated');
      }
      return processPaymentApi(userId);
    },
    onSuccess: () => {
      toast({
        title: "Payment successful",
        description: "You can now start your quiz!"
      });
    },
  });

  const processPayment = async () => {
    return await paymentMutation.mutateAsync();
  };

  return {
    payments,
    processPayment,
  };
};
