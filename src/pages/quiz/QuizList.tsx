
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/AuthContext';
import { useQuiz } from '@/QuizContext';
import { useQuizzes } from '@/hooks/useQuizzes';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, DollarSign, Play, Users } from 'lucide-react';
import { Quiz } from '@/types/quiz';

const QuizList: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading, isStudent } = useAuth();
  const { categories, setQuizInfo } = useQuiz();
  const { quizzes, isLoading: quizzesLoading } = useQuizzes();
  
  // Redirect if not logged in or not a student
  useEffect(() => {
    if (!isLoading && (!user || !isStudent)) {
      navigate('/login');
    }
  }, [user, isLoading, isStudent, navigate]);
  
  const handleStartQuiz = (quiz: Quiz) => {
    // Set quiz info for selected quiz
    setQuizInfo({
      age: (user as any)?.age || 18,
      interests: (user as any)?.interests || [],
      strengths: (user as any)?.strengths || [],
      weakSubjects: (user as any)?.weakSubjects || [],
      selectedQuiz: quiz.id,
      quizType: 'admin-created' as const
    });
    
    // Navigate to payment page
    navigate('/quiz/payment');
  };
  
  const getCategoryNames = (categoryDistribution: any[]) => {
    return categoryDistribution.map(dist => {
      const category = categories.find(c => c.id === dist.categoryId);
      return category?.name || 'Unknown Category';
    }).join(', ');
  };
  
  if (isLoading || !user || !isStudent) {
    return <div className="p-10 text-center">Loading...</div>;
  }
  
  return (
    <Layout>
      <div className="container py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Available Quizzes</h1>
          <p className="text-muted-foreground">
            Choose from our curated selection of professional quizzes
          </p>
        </div>
        
        {quizzesLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading quizzes...</p>
          </div>
        ) : quizzes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{quiz.name}</CardTitle>
                    <Badge variant="secondary" className="text-sm font-semibold">
                      ${quiz.price.toFixed(2)}
                    </Badge>
                  </div>
                  <CardDescription className="text-sm">
                    {quiz.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <BookOpen className="h-4 w-4 mr-2" />
                      <span>Categories: {getCategoryNames(quiz.categoryDistribution)}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>Est. Time: 30-45 minutes</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="h-4 w-4 mr-2" />
                      <span>Professional Assessment</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <Button 
                      onClick={() => handleStartQuiz(quiz)}
                      className="w-full"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start Quiz - ${quiz.price.toFixed(2)}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Quizzes Available</h3>
            <p className="text-muted-foreground mb-6">
              There are currently no quizzes available. Check back later!
            </p>
            <Button onClick={() => navigate('/quiz/info')}>
              Try Custom Quiz Instead
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default QuizList;
