
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/AuthContext';
import { useQuiz } from '@/QuizContext';
import Layout from '@/components/layout/Layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { Student, QuizResult, Payment, QuizInfo } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { 
  CalendarClock, 
  CreditCard, 
  Trophy, 
  FileText,
  User,
  Book,
  Brain,
  Star,
  AlertTriangle,
  BookOpen,
  Eye
} from 'lucide-react';

const StudentHistory: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading, isStudent } = useAuth();
  const { quizResults, payments } = useQuiz();
  
  const [selectedQuizResult, setSelectedQuizResult] = useState<QuizResult | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isQuizDetailOpen, setIsQuizDetailOpen] = useState(false);
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
  
  const handleViewQuizResult = (result: QuizResult) => {
    setSelectedQuizResult(result);
    setIsQuizDetailOpen(true);
  };
  
  const handleViewPayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsPaymentDetailOpen(true);
  };
  
  const handleViewFullResult = (resultId: string) => {
    navigate(`/results/${resultId}`);
  };
  
  return (
    <Layout>
      <div className="container py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">My History</h1>
            <p className="text-muted-foreground">View your quiz results and payment history</p>
          </div>
          <Button onClick={() => navigate('/dashboard')} className="mt-4 md:mt-0">
            Back to Dashboard
          </Button>
        </div>
        
        <Tabs defaultValue="quiz" className="space-y-6">
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
            <TabsTrigger value="quiz" className="flex items-center">
              <Trophy className="mr-2 h-4 w-4" />
              Quiz Results
            </TabsTrigger>
            <TabsTrigger value="payment" className="flex items-center">
              <CreditCard className="mr-2 h-4 w-4" />
              Payment History
            </TabsTrigger>
          </TabsList>
          
          {/* Quiz Results Tab */}
          <TabsContent value="quiz">
            <Card>
              <CardHeader>
                <CardTitle>Quiz Results</CardTitle>
                <CardDescription>Your completed quizzes and scores</CardDescription>
              </CardHeader>
              <CardContent>
                {studentResults.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Questions</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {studentResults.map((result) => (
                        <TableRow key={result.id}>
                          <TableCell>
                            <div className="flex flex-col">
                              <span>{new Date(result.completedAt).toLocaleDateString()}</span>
                              <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(result.completedAt), { addSuffix: true })}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={
                              result.score >= 80 ? "bg-green-500" : 
                              result.score >= 60 ? "bg-yellow-500" : 
                              "bg-red-500"
                            }>
                              {result.score}%
                            </Badge>
                          </TableCell>
                          <TableCell>{result.totalQuestions}</TableCell>
                          <TableCell>
                            <Badge variant="outline">Completed</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleViewQuizResult(result)}
                              >
                                <Eye className="h-3.5 w-3.5 mr-1" />
                                Details
                              </Button>
                              <Button 
                                variant="default" 
                                size="sm"
                                onClick={() => handleViewFullResult(result.id)}
                              >
                                <FileText className="h-3.5 w-3.5 mr-1" />
                                Full Report
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-12">
                    <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No quiz results yet</h3>
                    <p className="text-muted-foreground mb-6">You haven't completed any quizzes yet.</p>
                    <Button onClick={() => navigate('/quiz/info')}>
                      Take Your First Quiz
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Payment History Tab */}
          <TabsContent value="payment">
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>Your payment records for quiz sessions</CardDescription>
              </CardHeader>
              <CardContent>
                {studentPayments.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Quiz Session</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {studentPayments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell>
                            <div className="flex flex-col">
                              <span>{new Date(payment.createdAt).toLocaleDateString()}</span>
                              <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(payment.createdAt), { addSuffix: true })}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>${payment.amount.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge className={
                              payment.status === 'completed' ? "bg-green-500" : 
                              payment.status === 'pending' ? "bg-yellow-500" : 
                              "bg-red-500"
                            }>
                              {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {payment.quizSessionId ? (
                              <Badge variant="outline">Used</Badge>
                            ) : (
                              <Badge variant="outline" className="bg-blue-100 text-blue-800">
                                Available
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewPayment(payment)}
                            >
                              <Eye className="h-3.5 w-3.5 mr-1" />
                              Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-12">
                    <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No payment history yet</h3>
                    <p className="text-muted-foreground mb-6">You haven't made any payments yet.</p>
                    <Button onClick={() => navigate('/quiz/payment')}>
                      Make Your First Payment
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Quiz Result Details Dialog */}
        <Dialog open={isQuizDetailOpen} onOpenChange={setIsQuizDetailOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Quiz Result Details</DialogTitle>
              <DialogDescription>
                Completed on {selectedQuizResult ? new Date(selectedQuizResult.completedAt).toLocaleDateString() : ''}
              </DialogDescription>
            </DialogHeader>
            
            {selectedQuizResult && (
              <div className="space-y-6 py-4">
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                  <div className="flex flex-col items-center justify-center bg-muted p-4 rounded-lg">
                    <Trophy className="h-8 w-8 text-primary mb-2" />
                    <div className="text-xl font-bold">{selectedQuizResult.score}%</div>
                    <div className="text-sm text-muted-foreground">Final Score</div>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center bg-muted p-4 rounded-lg">
                    <Book className="h-8 w-8 text-primary mb-2" />
                    <div className="text-xl font-bold">{selectedQuizResult.totalQuestions}</div>
                    <div className="text-sm text-muted-foreground">Questions</div>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center bg-muted p-4 rounded-lg">
                    <CalendarClock className="h-8 w-8 text-primary mb-2" />
                    <div className="text-xl font-bold">{formatDistanceToNow(new Date(selectedQuizResult.completedAt), { addSuffix: false })}</div>
                    <div className="text-sm text-muted-foreground">Time Ago</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Star className="h-5 w-5 text-yellow-500 mr-2" />
                    Strengths
                  </h3>
                  <ul className="list-disc pl-6 space-y-1">
                    {selectedQuizResult.feedback.strengths.map((strength, i) => (
                      <li key={i}>{strength}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold flex items-center">
                    <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
                    Areas to Improve
                  </h3>
                  <ul className="list-disc pl-6 space-y-1">
                    {selectedQuizResult.feedback.weakAreas.map((area, i) => (
                      <li key={i}>{area}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Brain className="h-5 w-5 text-purple-500 mr-2" />
                    Personality Insights
                  </h3>
                  <p className="text-pretty">{selectedQuizResult.feedback.personalitySummary}</p>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold flex items-center">
                    <BookOpen className="h-5 w-5 text-blue-500 mr-2" />
                    Career Suggestions
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedQuizResult.feedback.careerSuggestions.map((career, i) => (
                      <div key={i} className="bg-muted p-2 rounded-md">
                        {career}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsQuizDetailOpen(false)}>
                Close
              </Button>
              {selectedQuizResult && (
                <Button onClick={() => handleViewFullResult(selectedQuizResult.id)}>
                  View Full Report
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
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
                              navigate('/quiz/info');
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
