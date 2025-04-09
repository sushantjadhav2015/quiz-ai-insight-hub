
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/AuthContext';
import { useQuiz } from '@/QuizContext';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Trophy, Brain, Sparkles, Lightbulb, Target, ArrowRight, Download, Share2 } from 'lucide-react';
import { QuizResult as QuizResultType } from '@/types';

const QuizResult: React.FC = () => {
  const navigate = useNavigate();
  const { resultId } = useParams<{ resultId: string }>();
  const { user, isLoading, isStudent } = useAuth();
  const { quizResults } = useQuiz();
  
  const [result, setResult] = useState<QuizResultType | null>(null);
  
  // Find the result based on the ID
  useEffect(() => {
    if (resultId && quizResults.length > 0) {
      const foundResult = quizResults.find(r => r.id === resultId);
      setResult(foundResult || null);
    }
  }, [resultId, quizResults]);
  
  // Redirect if not logged in or not a student
  useEffect(() => {
    if (!isLoading && (!user || !isStudent)) {
      navigate('/login');
    }
  }, [user, isLoading, isStudent, navigate]);
  
  if (isLoading || !user || !isStudent) {
    return <div className="p-10 text-center">Loading...</div>;
  }
  
  if (!result) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h2 className="text-2xl font-semibold mb-4">Result Not Found</h2>
          <p className="text-muted-foreground mb-8">
            The quiz result you're looking for doesn't exist or you don't have access to it.
          </p>
          <Button onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container max-w-4xl py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Your Quiz Results</h1>
            <p className="text-muted-foreground">
              Completed on {new Date(result.completedAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
        
        {/* Score Overview */}
        <Card className="mb-8">
          <CardHeader className="pb-3">
            <div className="flex items-center">
              <Trophy className="mr-2 h-5 w-5 text-primary" />
              <CardTitle>Score Overview</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center p-4">
              <div className="relative w-40 h-40 flex items-center justify-center mb-4">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    className="text-muted stroke-current"
                    strokeWidth="10"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                  ></circle>
                  <circle
                    className="text-primary stroke-current"
                    strokeWidth="10"
                    strokeLinecap="round"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    strokeDasharray={`${result.score * 2.51} 251.2`}
                    strokeDashoffset="0"
                    transform="rotate(-90 50 50)"
                  ></circle>
                </svg>
                <div className="absolute">
                  <p className="text-4xl font-bold">{result.score}%</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Based on {result.totalQuestions} questions
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* Strengths and Weaknesses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Strengths */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center">
                <Sparkles className="mr-2 h-5 w-5 text-primary" />
                <CardTitle>Your Strengths</CardTitle>
              </div>
              <CardDescription>
                Areas where you excel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {result.feedback.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 mr-2"></div>
                    <div>
                      <span className="font-medium">{strength}</span>
                      <Progress value={85 - index * 10} className="h-1.5 mt-1 mb-1" />
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          {/* Weaknesses */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center">
                <Target className="mr-2 h-5 w-5 text-primary" />
                <CardTitle>Areas to Improve</CardTitle>
              </div>
              <CardDescription>
                Areas for further development
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {result.feedback.weakAreas.map((area, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 mr-2"></div>
                    <div>
                      <span className="font-medium">{area}</span>
                      <Progress value={55 - index * 10} className="h-1.5 mt-1 mb-1" />
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
        
        {/* AI Insights and Career Suggestions */}
        <div className="grid grid-cols-1 gap-6 mb-8">
          {/* Personality Summary */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center">
                <Brain className="mr-2 h-5 w-5 text-primary" />
                <CardTitle>Personality Insights</CardTitle>
              </div>
              <CardDescription>
                AI-generated analysis of your personality traits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-pretty leading-relaxed">
                {result.feedback.personalitySummary}
              </p>
            </CardContent>
          </Card>
          
          {/* Career Recommendations */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center">
                <Lightbulb className="mr-2 h-5 w-5 text-primary" />
                <CardTitle>Recommended Career Paths</CardTitle>
              </div>
              <CardDescription>
                Career suggestions based on your strengths and interests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.feedback.careerSuggestions.map((career, index) => (
                  <div key={index} className="bg-muted p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">{career}</h3>
                    <p className="text-sm text-muted-foreground">
                      Aligns with your strengths in {result.feedback.strengths[index % result.feedback.strengths.length]}
                    </p>
                    <div className="mt-2">
                      <Progress value={90 - index * 10} className="h-1.5" />
                      <p className="text-xs text-muted-foreground mt-1">Match score: {90 - index * 10}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
            <CardDescription>
              Continue your assessment journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>
                Now that you've completed this quiz, you can:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center" onClick={() => navigate('/quiz/info')}>
                  <Brain className="h-6 w-6 mb-2" />
                  <span>Take Another Quiz</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center" onClick={() => navigate('/dashboard')}>
                  <Trophy className="h-6 w-6 mb-2" />
                  <span>View Dashboard</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center">
                  <Lightbulb className="h-6 w-6 mb-2" />
                  <span>Explore Resources</span>
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={() => navigate('/dashboard')}>
              Back to Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default QuizResult;
