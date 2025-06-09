
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Payment } from '@/types';
import { CreditCard, Trophy } from 'lucide-react';

interface PaymentDetailsDialogProps {
  payment: Payment | null;
  isOpen: boolean;
  onClose: () => void;
  onStartQuiz: (paymentId: string) => void;
}

const PaymentDetailsDialog: React.FC<PaymentDetailsDialogProps> = ({
  payment,
  isOpen,
  onClose,
  onStartQuiz
}) => {
  if (!payment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Payment Details</DialogTitle>
          <DialogDescription>
            Transaction made on {new Date(payment.createdAt).toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex justify-center mb-4">
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
              <CreditCard className="h-12 w-12 text-primary" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Payment ID</p>
              <p className="font-medium">{payment.id}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Amount</p>
              <p className="font-medium">${payment.amount.toFixed(2)}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge className={
                payment.status === 'completed' ? "bg-green-500" : 
                payment.status === 'pending' ? "bg-yellow-500" : 
                "bg-red-500"
              }>
                {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
              </Badge>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Date</p>
              <p className="font-medium">{new Date(payment.createdAt).toLocaleDateString()}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Quiz Session</p>
              <p className="font-medium">
                {payment.quizSessionId ? payment.quizSessionId : 'Not used yet'}
              </p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Status</p>
              {payment.quizSessionId ? (
                <Badge variant="outline">Used for quiz</Badge>
              ) : (
                <Badge variant="outline" className="bg-blue-100 text-blue-800">
                  Available for quiz
                </Badge>
              )}
            </div>
          </div>
          
          {!payment.quizSessionId && (
            <div className="mt-6 p-4 bg-blue-50 rounded-md">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Trophy className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Ready for Quiz</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>
                      This payment is available to use for a quiz session. You can start a new quiz now.
                    </p>
                  </div>
                  <div className="mt-4">
                    <Button 
                      size="sm" 
                      onClick={() => {
                        onClose();
                        onStartQuiz(payment.id);
                      }}
                    >
                      Start Quiz
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDetailsDialog;
