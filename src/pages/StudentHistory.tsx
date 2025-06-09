
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/AuthContext';
import { useQuiz } from '@/QuizContext';
import Layout from '@/components/layout/Layout';
import QuizHistoryTable from '@/components/quiz/QuizHistoryTable';
import PaymentDetailsDialog from '@/components/quiz/PaymentDetailsDialog';
import EmptyQuizHistory from '@/components/quiz/EmptyQuizHistory';
import QuizHistoryHeader from '@/components/quiz/QuizHistoryHeader';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Payment } from '@/types';

const StudentHistory: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading, isStudent } = useAuth();
  const { quizResults, payments, setQuizInfo } = useQuiz();
  
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isPaymentDetailOpen, setIsPaymentDetailOpen] = useState(false);

  // Get the student's quiz history and payment history
  const studentResults = quizResults.filter(result => result.userId === user?.id);
  const studentPayments = payments.filter(payment => payment.userId === user?.id);
  
  // Redirect if not logged in or not a student
  React.useEffect(() => {
    if (!isLoading && (!user || !isStudent)) {
      navigate('/login');
    }
  }, [user, isLoading, isStudent, navigate]);
  
  if (isLoading || !user || !isStudent) {
    return <div className="p-10 text-center">Loading...</div>;
  }
  
  const handleStartQuiz = (paymentId: string) => {
    // Set basic quiz info and navigate to quiz session
    setQuizInfo({
      age: (user as any)?.age || 18,
      interests: (user as any)?.interests || [],
      strengths: (user as any)?.strengths || [],
      weakSubjects: (user as any)?.weakSubjects || [],
      quizType: 'traditional' as const
    });
    
    navigate('/quiz/session');
  };
  
  const handleViewResult = (resultId: string) => {
    navigate(`/results/${resultId}`);
  };
  
  const handleViewPayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsPaymentDetailOpen(true);
  };
  
  const hasQuizHistory = studentResults.length > 0 || studentPayments.length > 0;
  
  return (
    <Layout>
      <div className="container py-10">
        <QuizHistoryHeader />
        
        <Card>
          <CardHeader>
            <CardTitle>Your Quiz Activities</CardTitle>
            <CardDescription>
              All your quiz payments, sessions, and results in one place
            </CardDescription>
          </CardHeader>
          <CardContent>
            {hasQuizHistory ? (
              <QuizHistoryTable
                quizResults={studentResults}
                payments={studentPayments}
                onStartQuiz={handleStartQuiz}
                onViewResult={handleViewResult}
                onViewPayment={(paymentId) => {
                  const payment = studentPayments.find(p => p.id === paymentId);
                  if (payment) handleViewPayment(payment);
                }}
              />
            ) : (
              <EmptyQuizHistory />
            )}
          </CardContent>
        </Card>
        
        <PaymentDetailsDialog
          payment={selectedPayment}
          isOpen={isPaymentDetailOpen}
          onClose={() => setIsPaymentDetailOpen(false)}
          onStartQuiz={handleStartQuiz}
        />
      </div>
    </Layout>
  );
};

export default StudentHistory;
