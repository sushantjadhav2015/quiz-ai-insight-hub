
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/AuthContext';
import { useQuiz } from '@/QuizContext';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Loader2, Clock, BookOpen, AlertTriangle, CheckCircle, ArrowRight, AlertCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const QuizSession: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading, isStudent } = useAuth();
  const { quizInfo, currentQuizSession, startQuiz, submitQuiz, getQuizSessionSecurityStatus } = useQuiz();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(1800); // 30 minutes in seconds
  const [securityViolation, setSecurityViolation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Start the quiz if needed
  useEffect(() => {
    if (!isLoading && user && isStudent && quizInfo && !currentQuizSession) {
      const initiateQuiz = async () => {
        try {
          await startQuiz();
        } catch (error) {
          toast({
            title: "Cannot start quiz",
            description: (error as Error).message,
            variant: "destructive",
          });
          navigate('/quiz/payment');
        }
      };
      
      initiateQuiz();
    }
  }, [isLoading, user, isStudent, quizInfo, currentQuizSession, startQuiz, navigate]);
  
  // Initialize answers array when quiz session is available
  useEffect(() => {
    if (currentQuizSession && currentQuizSession.questions && currentQuizSession.questions.length > 0) {
      setAnswers(new Array(currentQuizSession.questions.length).fill(-1));
    }
  }, [currentQuizSession]);
  
  // Timer functionality
  useEffect(() => {
    if (currentQuizSession && !currentQuizSession.completed) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            // Time's up, submit quiz automatically
            clearInterval(timerRef.current as NodeJS.Timeout);
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentQuizSession]);
  
  // Security checks for quiz session
  useEffect(() => {
    const checkSecurity = () => {
      const securityStatus = getQuizSessionSecurityStatus();
      if (!securityStatus.isSecure) {
        setSecurityViolation(true);
        toast({
          title: "Security violation",
          description: securityStatus.message || "Quiz session has been compromised",
          variant: "destructive",
        });
      }
    };
    
    // Check security on load
    checkSecurity();
    
    // Set up event listeners for security checks
    const handleVisibilityChange = () => {
      if (document.hidden && currentQuizSession && !currentQuizSession.completed) {
        setSecurityViolation(true);
        toast({
          title: "Security violation",
          description: "Leaving the quiz page is not allowed",
          variant: "destructive",
        });
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [currentQuizSession, getQuizSessionSecurityStatus]);
  
  // Mutation for submitting quiz
  const submitQuizMutation = useMutation({
    mutationFn: (quizAnswers: number[]) => submitQuiz(quizAnswers),
    onSuccess: (result) => {
      toast({
        title: "Quiz completed",
        description: "Your results are ready!",
      });
      navigate(`/results/${result.id}`);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to submit quiz",
        description: error.message,
        variant: "destructive",
      });
      setIsSubmitting(false);
    },
  });
  
  const handleSelectAnswer = (optionIndex: number) => {
    if (isSubmitting || securityViolation) return;
    
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setAnswers(newAnswers);
  };
  
  const handleNextQuestion = () => {
    if (currentQuizSession && currentQuestionIndex < currentQuizSession.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  const handleSubmitQuiz = () => {
    if (!currentQuizSession || securityViolation) return;
    
    // Check if all questions have been answered
    const unansweredQuestions = answers.filter(a => a === -1).length;
    
    if (unansweredQuestions > 0) {
      toast({
        title: `${unansweredQuestions} question${unansweredQuestions > 1 ? 's' : ''} unanswered`,
        description: "Please answer all questions before submitting",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    submitQuizMutation.mutate(answers);
  };
  
  // Helper function to format time
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  // Helper function to get category name
  const getCategoryName = (categoryId: string) => {
    const categoryNames: Record<string, string> = {
      '1': 'Aptitude',
      '2': 'Logical Reasoning',
      '3': 'Personality',
      '4': 'Subject Interest',
      '5': 'Situational Judgement'
    };
    return categoryNames[categoryId] || 'General';
  };
  
  // Redirect if not logged in or not a student
  useEffect(() => {
    if (!isLoading && (!user || !isStudent)) {
      navigate('/login');
    }
  }, [user, isLoading, isStudent, navigate]);
  
  if (isLoading || !user || !isStudent) {
    return <div className="p-10 text-center">Loading...</div>;
  }
  
  if (!currentQuizSession || !currentQuizSession.questions || currentQuizSession.questions.length === 0) {
    return (
      <Layout hideFooter>
        <div className="container py-10 text-center">
          <div className="flex justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
          <h2 className="mt-4 text-2xl font-semibold">Preparing your quiz...</h2>
          <p className="mt-2 text-muted-foreground">
            This will only take a moment
          </p>
        </div>
      </Layout>
    );
  }
  
  const currentQuestion = currentQuizSession.questions[currentQuestionIndex];
  
  // Additional safety check for current question
  if (!currentQuestion || !currentQuestion.options || !Array.isArray(currentQuestion.options)) {
    return (
      <Layout hideFooter>
        <div className="container py-10 text-center">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              There was an issue loading the quiz questions. Please try again.
            </AlertDescription>
          </Alert>
          <Button onClick={() => navigate('/quiz/payment')} className="mt-4">
            Back to Quiz Setup
          </Button>
        </div>
      </Layout>
    );
  }
  
  const progress = ((currentQuestionIndex + 1) / currentQuizSession.questions.length) * 100;
  
  return (
    <Layout hideFooter>
      <div className="container max-w-4xl py-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Quiz in Progress</h1>
            <p className="text-muted-foreground">
              Question {currentQuestionIndex + 1} of {currentQuizSession.questions.length}
            </p>
          </div>
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-muted-foreground mr-2" />
            <span className={`font-medium ${timeRemaining < 300 ? 'text-destructive' : ''}`}>
              Time remaining: {formatTime(timeRemaining)}
            </span>
          </div>
        </div>
        
        <div className="mb-8">
          <Progress value={progress} className="h-2" />
        </div>
        
        {securityViolation ? (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Security violation detected. Your quiz session has been terminated. Please contact support for assistance.
            </AlertDescription>
          </Alert>
        ) : null}
        
        <Card className="mb-6 quiz-bg">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Question {currentQuestionIndex + 1}</CardTitle>
              <div className="flex items-center text-sm text-muted-foreground">
                <BookOpen className="h-4 w-4 mr-1" />
                {getCategoryName(currentQuestion.categoryId)}
              </div>
            </div>
            <CardDescription className="text-lg font-medium text-foreground">
              {currentQuestion.text || 'Question text unavailable'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentQuestion.options.map((option, index) => (
                <div
                  key={index}
                  className={`p-4 border rounded-lg transition-all cursor-pointer ${
                    answers[currentQuestionIndex] === index
                      ? 'border-primary bg-primary/5'
                      : 'hover:border-input hover:bg-accent/50'
                  }`}
                  onClick={() => handleSelectAnswer(index)}
                >
                  <div className="flex items-center">
                    <div className={`flex items-center justify-center w-6 h-6 rounded-full border ${
                      answers[currentQuestionIndex] === index
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-muted-foreground'
                    } mr-3`}>
                      {answers[currentQuestionIndex] === index ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <span className="text-xs">{String.fromCharCode(65 + index)}</span>
                      )}
                    </div>
                    <span>{option || `Option ${index + 1}`}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0 || securityViolation}
            >
              Previous
            </Button>
            
            {currentQuestionIndex === currentQuizSession.questions.length - 1 ? (
              <Button
                onClick={handleSubmitQuiz}
                disabled={isSubmitting || securityViolation}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Quiz
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleNextQuestion}
                disabled={securityViolation}
              >
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </CardFooter>
        </Card>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center text-sm text-muted-foreground">
            <AlertCircle className="h-4 w-4 mr-1" />
            <span>Do not refresh or leave this page</span>
          </div>
          
          {currentQuestionIndex === currentQuizSession.questions.length - 1 && (
            <Button
              variant="outline"
              onClick={handleSubmitQuiz}
              disabled={isSubmitting || securityViolation}
            >
              {isSubmitting ? 'Submitting...' : 'Finish Quiz'}
            </Button>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default QuizSession;
