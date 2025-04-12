
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
import { PenTool, ArrowRight } from 'lucide-react';
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
      // Navigate to payment page
      navigate('/quiz/payment');
    },
    onError: (error: Error) => {
      setFormError(error.message);
    }
  });
  
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
          <h1 className="text-3xl font-bold">Quiz Information</h1>
          <p className="text-muted-foreground">
            Tell us about yourself so we can personalize your quiz experience
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left sidebar with steps */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Quiz Steps</CardTitle>
                <CardDescription>
                  Complete all steps to get your personalized insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold mr-3">
                      1
                    </div>
                    <div>
                      <h3 className="font-semibold">Fill Your Info</h3>
                      <p className="text-sm text-muted-foreground">
                        Provide your details and preferences
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-muted-foreground text-sm font-bold mr-3">
                      2
                    </div>
                    <div>
                      <h3 className="font-semibold text-muted-foreground">Payment</h3>
                      <p className="text-sm text-muted-foreground">
                        Complete payment to unlock your quiz
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-muted-foreground text-sm font-bold mr-3">
                      3
                    </div>
                    <div>
                      <h3 className="font-semibold text-muted-foreground">Take the Quiz</h3>
                      <p className="text-sm text-muted-foreground">
                        Answer questions in a secure environment
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-muted-foreground text-sm font-bold mr-3">
                      4
                    </div>
                    <div>
                      <h3 className="font-semibold text-muted-foreground">Get Results</h3>
                      <p className="text-sm text-muted-foreground">
                        Receive your personalized AI feedback
                      </p>
                    </div>
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
