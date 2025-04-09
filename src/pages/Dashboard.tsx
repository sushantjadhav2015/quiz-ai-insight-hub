
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/AuthContext';
import { useQuiz } from '@/QuizContext';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Brain, BookOpen, Zap, Trophy, ArrowRight } from 'lucide-react';
import { QuizResult, Student } from '@/types';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading, isStudent } = useAuth();
  const { quizResults } = useQuiz();
  
  // Redirect if not logged in or not a student
  useEffect(() => {
    if (!isLoading && (!user || !isStudent)) {
      navigate('/login');
    }
  }, [user, isLoading, isStudent, navigate]);
  
  if (isLoading || !user || !isStudent) {
    return <div className="p-10 text-center">Loading...</div>;
  }
  
  const studentUser = user as Student;
  
  // Get the last 5 quiz results, sorted by date
  const recentQuizzes = [...(studentUser.quizHistory || [])].sort(
    (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  ).slice(0, 5);
  
  const calculateAverageScore = (results: QuizResult[]) => {
    if (results.length === 0) return 0;
    const totalScore = results.reduce((sum, result) => sum + result.score, 0);
    return Math.round(totalScore / results.length);
  };
  
  const averageScore = calculateAverageScore(studentUser.quizHistory || []);
  
  const totalQuizzesTaken = studentUser.quizHistory?.length || 0;
  
  return (
    <Layout>
      <div className="container py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user.name}</p>
          </div>
          <Button 
            onClick={() => navigate('/quiz/info')}
            className="mt-4 md:mt-0"
          >
            Take New Quiz
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalQuizzesTaken}</div>
              <p className="text-xs text-muted-foreground">
                Quizzes completed
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageScore}%</div>
              <p className="text-xs text-muted-foreground">
                Across all quizzes
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Top Strength</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold truncate">
                {studentUser.strengths && studentUser.strengths.length > 0 
                  ? studentUser.strengths[0] 
                  : "Not identified"}
              </div>
              <p className="text-xs text-muted-foreground">
                From your profile
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Career Match</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold truncate">
                {recentQuizzes.length > 0 && recentQuizzes[0].feedback.careerSuggestions.length > 0
                  ? recentQuizzes[0].feedback.careerSuggestions[0]
                  : "Take a quiz"}
              </div>
              <p className="text-xs text-muted-foreground">
                Top career suggestion
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Quizzes */}
        <h2 className="text-xl font-semibold mb-4">Recent Quizzes</h2>
        {recentQuizzes.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {recentQuizzes.map((quiz) => (
              <Card key={quiz.id}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Quiz Result #{quiz.id}</CardTitle>
                    <div className="text-sm">
                      {new Date(quiz.completedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <CardDescription>
                    Score: <span className="font-medium">{quiz.score}%</span> ({quiz.totalQuestions} questions)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-semibold mb-2">Your Strengths</h3>
                      <ul className="space-y-1">
                        {quiz.feedback.strengths.slice(0, 3).map((strength, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-center">
                            <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold mb-2">Areas to Improve</h3>
                      <ul className="space-y-1">
                        {quiz.feedback.weakAreas.slice(0, 3).map((area, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-center">
                            <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                            {area}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/results/${quiz.id}`)}
                  >
                    View Full Results
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="bg-muted rounded-lg p-8 text-center">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No quizzes taken yet</h3>
            <p className="text-muted-foreground mb-4">
              Complete your first quiz to get personalized insights
            </p>
            <Button onClick={() => navigate('/quiz/info')}>
              Start Your First Quiz
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
