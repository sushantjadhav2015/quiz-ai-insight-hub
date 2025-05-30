
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/AuthContext';
import { useQuiz } from '@/QuizContext';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Brain, Target, User, BookOpen, Briefcase, Lightbulb, ArrowRight, CheckCircle } from 'lucide-react';
import { Student, Category } from '@/types';

const QuizCategorySelection: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading, isStudent } = useAuth();
  const { categories, setQuizInfo } = useQuiz();
  
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [basePrice] = useState(15);
  const [pricePerCategory] = useState(10);
  
  const studentUser = user as Student;
  
  // Redirect if not logged in or not a student
  useEffect(() => {
    if (!isLoading && (!user || !isStudent)) {
      navigate('/login');
    }
  }, [user, isLoading, isStudent, navigate]);
  
  // Smart category suggestions based on user profile
  const getRecommendedCategories = () => {
    const recommendations: string[] = [];
    
    if (studentUser?.interests?.some(interest => 
      interest.toLowerCase().includes('logic') || 
      interest.toLowerCase().includes('math') ||
      interest.toLowerCase().includes('problem')
    )) {
      recommendations.push('1', '2'); // Aptitude, Logical Reasoning
    }
    
    if (studentUser?.interests?.some(interest => 
      interest.toLowerCase().includes('personality') ||
      interest.toLowerCase().includes('psychology') ||
      interest.toLowerCase().includes('behavior')
    )) {
      recommendations.push('3'); // Personality
    }
    
    if (studentUser?.weakSubjects?.length > 0) {
      recommendations.push('4'); // Subject Interest
    }
    
    // Always recommend situational judgement for career guidance
    recommendations.push('5');
    
    return [...new Set(recommendations)];
  };
  
  const recommendedCategories = getRecommendedCategories();
  
  // Initialize with recommended categories
  useEffect(() => {
    if (recommendedCategories.length > 0 && selectedCategories.length === 0) {
      setSelectedCategories(recommendedCategories);
    }
  }, [recommendedCategories]);
  
  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };
  
  const calculateTotalPrice = () => {
    return basePrice + (selectedCategories.length * pricePerCategory);
  };
  
  const handleProceedToPayment = () => {
    if (selectedCategories.length === 0) {
      return;
    }
    
    // Set quiz info for category-based quiz
    setQuizInfo({
      age: studentUser?.age || 18,
      interests: studentUser?.interests || [],
      strengths: studentUser?.strengths || [],
      weakSubjects: studentUser?.weakSubjects || [],
      selectedCategories,
      quizType: 'category-based'
    });
    
    navigate('/quiz/payment');
  };
  
  const getCategoryIcon = (categoryId: string) => {
    switch (categoryId) {
      case '1': return <Brain className="h-5 w-5" />;
      case '2': return <Target className="h-5 w-5" />;
      case '3': return <User className="h-5 w-5" />;
      case '4': return <BookOpen className="h-5 w-5" />;
      case '5': return <Briefcase className="h-5 w-5" />;
      default: return <Lightbulb className="h-5 w-5" />;
    }
  };
  
  if (isLoading || !user || !isStudent) {
    return <div className="p-10 text-center">Loading...</div>;
  }
  
  return (
    <Layout>
      <div className="container max-w-4xl py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Choose Your Quiz Categories</h1>
          <p className="text-muted-foreground">
            Select the areas you'd like to focus on. We've pre-selected categories based on your profile.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Category Selection */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Available Categories</CardTitle>
                <CardDescription>
                  Choose the categories you want to include in your personalized quiz
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categories.map((category: Category) => {
                    const isSelected = selectedCategories.includes(category.id);
                    const isRecommended = recommendedCategories.includes(category.id);
                    
                    return (
                      <div
                        key={category.id}
                        className={`p-4 border rounded-lg transition-all cursor-pointer ${
                          isSelected 
                            ? 'border-primary bg-primary/5' 
                            : 'hover:border-input hover:bg-accent/50'
                        }`}
                        onClick={() => handleCategoryToggle(category.id)}
                      >
                        <div className="flex items-start">
                          <Checkbox
                            id={category.id}
                            checked={isSelected}
                            onChange={() => handleCategoryToggle(category.id)}
                            className="mt-1 mr-3"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {getCategoryIcon(category.id)}
                              <h3 className="font-semibold">{category.name}</h3>
                              {isRecommended && (
                                <Badge variant="secondary" className="text-xs">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Recommended
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {category.description}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {category.questionCount} questions available
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Pricing & Summary */}
          <div className="md:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Quiz Summary</CardTitle>
                <CardDescription>
                  Your personalized quiz details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">Selected Categories</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedCategories.length} categories selected
                    </p>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-sm">
                      <span>Base price</span>
                      <span>${basePrice}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>{selectedCategories.length} categories × ${pricePerCategory}</span>
                      <span>${selectedCategories.length * pricePerCategory}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg border-t pt-2 mt-2">
                      <span>Total</span>
                      <span>${calculateTotalPrice()}</span>
                    </div>
                  </div>
                  
                  {selectedCategories.length === 0 && (
                    <Alert>
                      <AlertDescription>
                        Please select at least one category to continue.
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <Button 
                    onClick={handleProceedToPayment}
                    disabled={selectedCategories.length === 0}
                    className="w-full"
                  >
                    Proceed to Payment
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default QuizCategorySelection;
