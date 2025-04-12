
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
  FileText, 
  CreditCard,
  Edit,
  User,
  Loader2
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const Students: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading, isAdmin } = useAuth();
  const { students } = useQuiz();
  
  // Redirect if not logged in or not an admin
  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      navigate('/login');
    }
  }, [user, isLoading, isAdmin, navigate]);
  
  if (isLoading || !user || !isAdmin) {
    return <div className="p-10 text-center">Loading...</div>;
  }
  
  console.log('Students data:', students); // Add this to debug
  
  return (
    <Layout>
      <div className="container py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Students</h1>
            <p className="text-muted-foreground">
              Manage student profiles and view their data
            </p>
          </div>
          <Button onClick={() => navigate('/admin/dashboard')} className="mt-4 md:mt-0">
            Back to Dashboard
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Student List</CardTitle>
            <CardDescription>
              View and manage all registered students
            </CardDescription>
          </CardHeader>
          <CardContent>
            {students.length === 0 ? (
              <div className="text-center py-12">
                <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No students found</h3>
                <p className="text-muted-foreground mb-6">There are no registered students in the system yet.</p>
                <Button onClick={() => navigate('/admin/dashboard')}>
                  Back to Dashboard
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow key={student.id} className="hover:bg-muted/50">
                        <TableCell>{student.id}</TableCell>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>{student.age || 'N/A'}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/admin/students/${student.id}`)}
                              title="View Profile"
                            >
                              <User className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/admin/students/${student.id}/quiz-history`)}
                              title="Quiz History"
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/admin/students/${student.id}/payments`)}
                              title="Payment History"
                            >
                              <CreditCard className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/admin/students/${student.id}/results`)}
                              title="View Results"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/admin/students/${student.id}/edit`)}
                              title="Edit Profile"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Students;
