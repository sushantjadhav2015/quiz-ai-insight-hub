
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/AuthContext';
import { useQuiz } from '@/QuizContext';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Zap, ArrowRight, CheckCircle, Lock, CreditCard } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const QuizPayment: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading, isStudent } = useAuth();
  const { quizInfo, processPayment } = useQuiz();
  
  // Redirect if not logged in, not a student, or no quiz info
  useEffect(() => {
    if (!isLoading) {
      if (!user || !isStudent) {
        navigate('/login');
      } else if (!quizInfo) {
        navigate('/quiz/info');
      }
    }
  }, [user, isLoading, isStudent, quizInfo, navigate]);
  
  const paymentMutation = useMutation({
    mutationFn: processPayment,
    onSuccess: () => {
      toast({
        title: "Payment successful",
        description: "You can now start your quiz!",
      });
      navigate('/quiz/session');
    },
    onError: (error: Error) => {
      toast({
        title: "Payment failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const handlePayment = () => {
    paymentMutation.mutate();
  };
  
  if (isLoading || !user || !isStudent || !quizInfo) {
    return <div className="p-10 text-center">Loading...</div>;
  }
  
  return (
    <Layout>
      <div className="container max-w-4xl py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Quiz Payment</h1>
          <p className="text-muted-foreground">
            Complete payment to unlock your personalized quiz
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left sidebar with steps */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Quiz Steps</CardTitle>
                <CardDescription>
                  Complete all steps to get your personalized insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold mr-3">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Fill Your Info</h3>
                      <p className="text-sm text-muted-foreground">
                        Provide your details and preferences
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold mr-3">
                      2
                    </div>
                    <div>
                      <h3 className="font-semibold">Payment</h3>
                      <p className="text-sm text-muted-foreground">
                        Complete payment to unlock your quiz
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-muted-foreground text-sm font-bold mr-3">
                      3
                    </div>
                    <div>
                      <h3 className="font-semibold text-muted-foreground">Take the Quiz</h3>
                      <p className="text-sm text-muted-foreground">
                        Answer questions in a secure environment
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-muted-foreground text-sm font-bold mr-3">
                      4
                    </div>
                    <div>
                      <h3 className="font-semibold text-muted-foreground">Get Results</h3>
                      <p className="text-sm text-muted-foreground">
                        Receive your personalized AI feedback
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Payment details */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center">
                  <Zap className="mr-2 h-5 w-5 text-primary" />
                  <CardTitle>Unlock Your Personalized Quiz</CardTitle>
                </div>
                <CardDescription>
                  One payment unlocks one complete quiz attempt with AI-powered feedback
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                    <div>
                      <h3 className="font-semibold">Personalized Assessment</h3>
                      <p className="text-sm text-muted-foreground">
                        Dynamic quiz with AI feedback
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">$9.99</p>
                      <p className="text-sm text-muted-foreground">One-time payment</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">What's included:</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                        <span>Personalized quiz based on your profile</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                        <span>Detailed AI analysis of your strengths & weaknesses</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                        <span>Career suggestions tailored to your abilities</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                        <span>Permanent access to your quiz results</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center mb-4">
                      <Lock className="h-5 w-5 text-muted-foreground mr-2" />
                      <p className="text-sm text-muted-foreground">Secure payment processing</p>
                    </div>
                    
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Quiz Price:</span>
                      <span>$9.99</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Tax:</span>
                      <span>$0.00</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="font-bold">Total:</span>
                      <span className="font-bold">$9.99</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handlePayment} 
                  className="w-full" 
                  disabled={paymentMutation.isPending}
                >
                  {paymentMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Pay $9.99 and Start Quiz
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default QuizPayment;
