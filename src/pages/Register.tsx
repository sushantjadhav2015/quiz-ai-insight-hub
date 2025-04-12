
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/AuthContext';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Brain, Loader2 } from 'lucide-react';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      termsAccepted: false,
    },
  });
  
  const watchPassword = watch("password");
  
  const registerMutation = useMutation({
    mutationFn: (data: RegisterFormData) => registerUser(data.name, data.email, data.password),
    onSuccess: () => {
      navigate('/dashboard');
    },
    onError: (error: Error) => {
      setFormError(error.message);
    }
  });
  
  const onSubmit = (data: RegisterFormData) => {
    setFormError(null);
    registerMutation.mutate(data);
  };

  const validateEmail = (value: string) => {
    return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value) || "Please enter a valid email address";
  };
  
  const validatePassword = (value: string) => {
    return value.length >= 6 || "Password must be at least 6 characters";
  };
  
  const validateConfirmPassword = (value: string) => {
    return value === watchPassword || "Passwords do not match";
  };
  
  return (
    <Layout>
      <div className="container max-w-lg py-20">
        <div className="mb-8 text-center">
          <div className="flex justify-center">
            <Brain className="h-12 w-12 text-primary" />
          </div>
          <h1 className="mt-4 text-3xl font-bold">Create an account</h1>
          <p className="mt-2 text-muted-foreground">
            Sign up for Quiz Insight to discover your strengths and potential career paths
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Register</CardTitle>
            <CardDescription>
              Fill in your information to create a new account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-4">
                {formError && (
                  <Alert variant="destructive">
                    <AlertDescription>
                      {formError}
                    </AlertDescription>
                  </Alert>
                )}
                
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    {...register('name', { 
                      required: "Name is required",
                      minLength: { value: 2, message: "Name must be at least 2 characters" }
                    })}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name.message}</p>
                  )}
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    {...register('email', { 
                      required: "Email is required",
                      validate: validateEmail
                    })}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    {...register('password', { 
                      required: "Password is required",
                      validate: validatePassword
                    })}
                  />
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password.message}</p>
                  )}
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...register('confirmPassword', { 
                      required: "Please confirm your password",
                      validate: validateConfirmPassword
                    })}
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="termsAccepted" 
                    {...register('termsAccepted', { 
                      required: "You must accept the terms and conditions" 
                    })} 
                  />
                  <label
                    htmlFor="termsAccepted"
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I agree to the{' '}
                    <a href="#" className="text-primary hover:underline">
                      terms of service
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-primary hover:underline">
                      privacy policy
                    </a>
                  </label>
                </div>
                {errors.termsAccepted && (
                  <p className="text-sm text-destructive">{errors.termsAccepted.message}</p>
                )}
                
                <Button
                  type="submit"
                  className="w-full"
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    'Create account'
                  )}
                </Button>
                
                <div className="mt-4 text-center text-sm">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary hover:underline">
                    Log in
                  </Link>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Register;
