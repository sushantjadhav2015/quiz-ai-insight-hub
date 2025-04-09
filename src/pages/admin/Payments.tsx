
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/AuthContext';
import { useQuiz } from '@/QuizContext';
import Layout from '@/components/layout/Layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Eye, 
  User,
  Check,
  X
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Payments: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading, isAdmin } = useAuth();
  const { payments, students, getStudentById } = useQuiz();
  
  // Redirect if not logged in or not an admin
  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      navigate('/login');
    }
  }, [user, isLoading, isAdmin, navigate]);
  
  if (isLoading || !user || !isAdmin) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  const getStudentName = (userId: string) => {
    const student = getStudentById(userId);
    return student ? student.name : `Student #${userId}`;
  };
  
  const getStatusBadge = (status: 'pending' | 'completed' | 'failed') => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-500">Failed</Badge>;
      default:
        return null;
    }
  };
  
  return (
    <Layout>
      <div className="container py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Payment Transactions</h1>
            <p className="text-muted-foreground">
              View and manage all payment transactions
            </p>
          </div>
          <Button onClick={() => navigate('/admin/dashboard')} className="mt-4 md:mt-0">
            Back to Dashboard
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>
              Complete record of all payment transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">ID</th>
                    <th className="text-left py-3 px-4 font-medium">Student</th>
                    <th className="text-left py-3 px-4 font-medium">Amount</th>
                    <th className="text-left py-3 px-4 font-medium">Date</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Quiz ID</th>
                    <th className="text-left py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">{payment.id}</td>
                      <td className="py-3 px-4">{getStudentName(payment.userId)}</td>
                      <td className="py-3 px-4">${payment.amount.toFixed(2)}</td>
                      <td className="py-3 px-4">{payment.createdAt.toLocaleDateString()}</td>
                      <td className="py-3 px-4">{getStatusBadge(payment.status)}</td>
                      <td className="py-3 px-4">{payment.quizSessionId || 'N/A'}</td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/admin/students/${payment.userId}`)}
                            title="View Student"
                          >
                            <User className="h-4 w-4" />
                          </Button>
                          
                          {payment.quizSessionId && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/admin/results/${payment.quizSessionId}`)}
                              title="View Quiz Result"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}
                          
                          {payment.status === 'pending' && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-green-500 hover:text-green-700"
                                onClick={() => {
                                  // Logic to approve payment
                                  toast({
                                    title: "Payment approved",
                                    description: `Payment #${payment.id} has been approved.`,
                                  });
                                }}
                                title="Approve Payment"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-500 hover:text-red-700"
                                onClick={() => {
                                  // Logic to decline payment
                                  toast({
                                    title: "Payment declined",
                                    description: `Payment #${payment.id} has been declined.`,
                                    variant: "destructive",
                                  });
                                }}
                                title="Decline Payment"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Payments;
