
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/AuthContext';
import { useQuiz } from '@/QuizContext';
import { useQuizzes } from '@/hooks/useQuizzes';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Shield, Clock, CheckCircle, ArrowLeft } from 'lucide-react';

const QuizPayment: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading, isStudent } = useAuth();
  const { quizInfo, processPayment } = useQuiz();
  const { quizzes } = useQuizzes();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Redirect if not logged in or not a student
  useEffect(() => {
    if (!isLoading && (!user || !isStudent)) {
      navigate('/login');
    }
  }, [user, isLoading, isStudent, navigate]);
  
  // Redirect if no quiz info
  useEffect(() => {
    if (!isLoading && !quizInfo) {
      navigate('/quiz/info');
    }
  }, [quizInfo, isLoading, navigate]);
  
  if (isLoading || !user || !isStudent || !quizInfo) {
    return <div className="p-10 text-center">Loading...</div>;
  }
  
  // Get selected quiz details if it's an admin-created quiz
  const selectedQuiz = quizInfo.selectedQuiz 
    ? quizzes.find(q => q.id === quizInfo.selectedQuiz)
    : null;
  
  // Calculate price based on quiz type
  const getQuizPrice = () => {
    if (quizInfo.quizType === 'admin-created' && selectedQuiz) {
      return selectedQuiz.price;
    }
    if (quizInfo.quizType === 'category-based' && quizInfo.selectedCategories) {
      const basePrice = 15;
      const pricePerCategory = 10;
      return basePrice + (quizInfo.selectedCategories.length * pricePerCategory);
    }
    return 9.99; // Traditional quiz price
  };
  
  const price = getQuizPrice();
  
  const getQuizTitle = () => {
    if (quizInfo.quizType === 'admin-created' && selectedQuiz) {
      return selectedQuiz.name;
    }
    if (quizInfo.quizType === 'category-based') {
      return 'Category-Based Quiz';
    }
    return 'Personalized Assessment Quiz';
  };
  
  const getQuizDescription = () => {
    if (quizInfo.quizType === 'admin-created' && selectedQuiz) {
      return selectedQuiz.description;
    }
    if (quizInfo.quizType === 'category-based') {
      return `Custom quiz focusing on ${quizInfo.selectedCategories?.length || 0} selected categories`;
    }
    return 'A comprehensive assessment tailored to your interests and goals';
  };
  
  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      await processPayment();
      navigate('/quiz/session');
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <Layout>
      <div className="container max-w-2xl py-10">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Complete Your Purchase</h1>
          <p className="text-muted-foreground">
            Secure payment to start your personalized quiz
          </p>
        </div>
        
        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>Review your quiz selection</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold">{getQuizTitle()}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {getQuizDescription()}
                  </p>
                  <div className="flex items-center mt-2">
                    <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Estimated time: 30-45 minutes
                    </span>
                  </div>
                </div>
                <Badge variant="secondary" className="text-lg font-semibold">
                  ${price.toFixed(2)}
                </Badge>
              </div>
              
              <Separator />
              
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total</span>
                <span>${price.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
          
          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5" />
                Payment Method
              </CardTitle>
              <CardDescription>
                Secure payment powered by Stripe
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-muted/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Shield className="h-5 w-5 text-green-600 mr-2" />
                      <span className="font-medium">Secure Payment</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      SSL Encrypted
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Your payment information is processed securely. We don't store your payment details.
                  </p>
                </div>
                
                <Button 
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full"
                  size="lg"
                >
                  {isProcessing ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Pay ${price.toFixed(2)} & Start Quiz
                    </>
                  )}
                </Button>
                
                <p className="text-xs text-center text-muted-foreground">
                  By proceeding, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </CardContent>
          </Card>
          
          {/* What's Included */}
          <Card>
            <CardHeader>
              <CardTitle>What's Included</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  <span>Comprehensive personality assessment</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  <span>Detailed results and insights</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  <span>Personalized career recommendations</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  <span>Downloadable results report</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default QuizPayment;
