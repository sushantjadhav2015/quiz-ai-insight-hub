
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/AuthContext';
import { useQuiz } from '@/QuizContext';
import Layout from '@/components/layout/Layout';
import QuizHistoryTable from '@/components/quiz/QuizHistoryTable';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { Student, QuizResult, Payment } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { 
  CalendarClock, 
  CreditCard, 
  Trophy, 
  FileText,
  BookOpen
} from 'lucide-react';

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
  
  return (
    <Layout>
      <div className="container py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Quiz History</h1>
            <p className="text-muted-foreground">Manage your quiz sessions, payments, and results</p>
          </div>
          <Button onClick={() => navigate('/dashboard')} className="mt-4 md:mt-0">
            Back to Dashboard
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Your Quiz Activities</CardTitle>
            <CardDescription>
              All your quiz payments, sessions, and results in one place
            </CardDescription>
          </CardHeader>
          <CardContent>
            {studentResults.length > 0 || studentPayments.length > 0 ? (
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
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No quiz history yet</h3>
                <p className="text-muted-foreground mb-6">You haven't taken any quizzes or made any payments yet.</p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={() => navigate('/quiz/info')}>
                    Start Your First Quiz
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/quiz/list')}>
                    Browse Quiz List
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Payment Details Dialog */}
        <Dialog open={isPaymentDetailOpen} onOpenChange={setIsPaymentDetailOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Payment Details</DialogTitle>
              <DialogDescription>
                Transaction made on {selectedPayment ? new Date(selectedPayment.createdAt).toLocaleDateString() : ''}
              </DialogDescription>
            </DialogHeader>
            
            {selectedPayment && (
              <div className="space-y-4 py-4">
                <div className="flex justify-center mb-4">
                  <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                    <CreditCard className="h-12 w-12 text-primary" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Payment ID</p>
                    <p className="font-medium">{selectedPayment.id}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Amount</p>
                    <p className="font-medium">${selectedPayment.amount.toFixed(2)}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge className={
                      selectedPayment.status === 'completed' ? "bg-green-500" : 
                      selectedPayment.status === 'pending' ? "bg-yellow-500" : 
                      "bg-red-500"
                    }>
                      {selectedPayment.status.charAt(0).toUpperCase() + selectedPayment.status.slice(1)}
                    </Badge>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">{new Date(selectedPayment.createdAt).toLocaleDateString()}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Quiz Session</p>
                    <p className="font-medium">
                      {selectedPayment.quizSessionId ? selectedPayment.quizSessionId : 'Not used yet'}
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Status</p>
                    {selectedPayment.quizSessionId ? (
                      <Badge variant="outline">Used for quiz</Badge>
                    ) : (
                      <Badge variant="outline" className="bg-blue-100 text-blue-800">
                        Available for quiz
                      </Badge>
                    )}
                  </div>
                </div>
                
                {!selectedPayment.quizSessionId && (
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
                              setIsPaymentDetailOpen(false);
                              handleStartQuiz(selectedPayment.id);
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
            )}
            
            <DialogFooter>
              <Button onClick={() => setIsPaymentDetailOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default StudentHistory;
