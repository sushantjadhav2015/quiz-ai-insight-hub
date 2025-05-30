
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/AuthContext';
import { useQuiz } from '@/QuizContext';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PenTool, ArrowRight, Target, Zap } from 'lucide-react';
import { Student } from '@/types';

// Define Zod schema for form validation
const quizInfoSchema = z.object({
  age: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number({ invalid_type_error: "Age is required" })
      .min(10, "Age must be at least 10")
      .max(100, "Age must be at most 100")
  ),
  interests: z.string()
    .min(3, "Please enter at least one interest")
    .refine(val => val.trim().length > 0, "Interests are required"),
  strengths: z.string()
    .min(3, "Please enter at least one strength")
    .refine(val => val.trim().length > 0, "Strengths are required"),
  weakSubjects: z.string()
    .min(3, "Please enter at least one area to improve")
    .refine(val => val.trim().length > 0, "Areas to improve are required"),
});

type QuizInfoFormData = z.infer<typeof quizInfoSchema>;

const QuizInfo: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading, isStudent, updateUserProfile } = useAuth();
  const { setQuizInfo } = useQuiz();
  const [formError, setFormError] = useState<string | null>(null);
  
  // Redirect if not logged in or not a student
  useEffect(() => {
    if (!isLoading && (!user || !isStudent)) {
      navigate('/login');
    }
  }, [user, isLoading, isStudent, navigate]);
  
  const studentUser = user as Student;
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<QuizInfoFormData>({
    resolver: zodResolver(quizInfoSchema),
    defaultValues: {
      age: studentUser?.age || undefined,
      interests: studentUser?.interests?.join(', ') || '',
      strengths: studentUser?.strengths?.join(', ') || '',
      weakSubjects: studentUser?.weakSubjects?.join(', ') || '',
    },
  });
  
  const updateProfileMutation = useMutation({
    mutationFn: (data: QuizInfoFormData) => {
      // Transform the data
      const formattedQuizInfo = {
        age: Number(data.age),
        interests: data.interests.split(',').map(item => item.trim()),
        strengths: data.strengths.split(',').map(item => item.trim()),
        weakSubjects: data.weakSubjects.split(',').map(item => item.trim()),
        quizType: 'traditional'
      };
      
      // Save to quiz context
      setQuizInfo(formattedQuizInfo);
      
      // Update user profile
      return updateUserProfile({
        age: formattedQuizInfo.age,
        interests: formattedQuizInfo.interests,
        strengths: formattedQuizInfo.strengths,
        weakSubjects: formattedQuizInfo.weakSubjects,
      });
    },
    onSuccess: () => {
      // Navigate to payment page for traditional quiz
      navigate('/quiz/payment');
    },
    onError: (error: Error) => {
      setFormError(error.message);
    }
  });
  
  const handleCategoryBasedQuiz = () => {
    // First update the profile, then navigate to category selection
    const currentFormData = {
      age: studentUser?.age || 18,
      interests: studentUser?.interests?.join(', ') || '',
      strengths: studentUser?.strengths?.join(', ') || '',
      weakSubjects: studentUser?.weakSubjects?.join(', ') || '',
    };
    
    updateUserProfile({
      age: currentFormData.age,
      interests: currentFormData.interests.split(',').map(item => item.trim()),
      strengths: currentFormData.strengths.split(',').map(item => item.trim()),
      weakSubjects: currentFormData.weakSubjects.split(',').map(item => item.trim()),
    }).then(() => {
      navigate('/quiz/categories');
    });
  };
  
  const onSubmit = (data: QuizInfoFormData) => {
    setFormError(null);
    updateProfileMutation.mutate(data);
  };
  
  if (isLoading || !user || !isStudent) {
    return <div className="p-10 text-center">Loading...</div>;
  }
  
  return (
    <Layout>
      <div className="container max-w-4xl py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Choose Your Quiz Experience</h1>
          <p className="text-muted-foreground">
            Tell us about yourself and select how you'd like to take your quiz
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left sidebar with steps */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Quiz Options</CardTitle>
                <CardDescription>
                  Choose the quiz experience that works best for you
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center mb-2">
                      <Target className="h-5 w-5 text-primary mr-2" />
                      <h3 className="font-semibold">Custom Categories</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Choose specific categories and get personalized recommendations
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleCategoryBasedQuiz}
                      className="w-full"
                    >
                      Choose Categories
                    </Button>
                  </div>
                  
                  <div className="p-4 border rounded-lg border-primary bg-primary/5">
                    <div className="flex items-center mb-2">
                      <Zap className="h-5 w-5 text-primary mr-2" />
                      <h3 className="font-semibold">Quick Assessment</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Complete our traditional comprehensive assessment
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Fill the form below to continue with this option
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Form */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center">
                  <PenTool className="mr-2 h-5 w-5 text-primary" />
                  <CardTitle>Tell Us About Yourself</CardTitle>
                </div>
                <CardDescription>
                  This information helps us create a quiz that's tailored to you
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="age">Your Age</Label>
                    <Input
                      id="age"
                      type="number"
                      {...register('age')}
                    />
                    {errors.age && (
                      <p className="text-sm text-destructive">{errors.age.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="interests">
                      Your Interests (separate with commas)
                    </Label>
                    <Textarea
                      id="interests"
                      placeholder="Technology, Science, Art, Music, Sports..."
                      {...register('interests')}
                    />
                    {errors.interests && (
                      <p className="text-sm text-destructive">{errors.interests.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="strengths">
                      Your Strengths (separate with commas)
                    </Label>
                    <Textarea
                      id="strengths"
                      placeholder="Problem solving, Creativity, Communication, Leadership..."
                      {...register('strengths')}
                    />
                    {errors.strengths && (
                      <p className="text-sm text-destructive">{errors.strengths.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="weakSubjects">
                      Areas You'd Like to Improve (separate with commas)
                    </Label>
                    <Textarea
                      id="weakSubjects"
                      placeholder="Math, Writing, Public speaking, History..."
                      {...register('weakSubjects')}
                    />
                    {errors.weakSubjects && (
                      <p className="text-sm text-destructive">{errors.weakSubjects.message}</p>
                    )}
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={updateProfileMutation.isPending}
                  >
                    {updateProfileMutation.isPending ? (
                      <>Processing...</>
                    ) : (
                      <>
                        Continue to Payment
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default QuizInfo;
