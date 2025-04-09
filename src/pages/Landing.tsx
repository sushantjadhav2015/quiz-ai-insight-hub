
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  Brain, 
  ChevronRight, 
  LineChart, 
  Lock, 
  MessageSquare, 
  PenTool, 
  Sparkles,
  UserCheck,
  Zap
} from 'lucide-react';

const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative hero-gradient py-20 md:py-32">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 md:pr-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-primary">Discover your strengths.</span> Let AI guide your future.
            </h1>
            <p className="text-lg mb-8 text-muted-foreground max-w-lg">
              Take personalized quizzes, get AI-powered insights, and discover your ideal career path based on your unique abilities and interests.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg"
                onClick={() => navigate('/register')}
                className="font-semibold"
              >
                Get Started
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/features')}
                className="font-semibold"
              >
                Explore Features
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 mt-10 md:mt-0">
            <div className="relative ml-auto">
              <div className="bg-card shadow-xl rounded-xl overflow-hidden border border-border">
                <div className="bg-accent p-4 border-b border-border">
                  <div className="flex items-center">
                    <Brain className="h-6 w-6 text-primary" />
                    <span className="text-lg font-semibold ml-2">Quiz Insight</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Your Strengths Analysis</h3>
                    <div className="space-y-3">
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary rounded-full h-2" style={{ width: '85%' }}></div>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-secondary rounded-full h-2" style={{ width: '72%' }}></div>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-accent rounded-full h-2" style={{ width: '92%' }}></div>
                      </div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Recommended Careers</h3>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">Data Science</span>
                      <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm">UX Design</span>
                      <span className="bg-accent/10 text-accent px-3 py-1 rounded-full text-sm">Project Management</span>
                    </div>
                  </div>
                  <div className="animate-pulse">
                    <div className="h-8 bg-muted rounded mb-3 w-3/4"></div>
                    <div className="h-8 bg-muted rounded mb-3"></div>
                    <div className="h-8 bg-muted rounded mb-3 w-5/6"></div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-secondary text-white p-4 rounded-lg shadow-lg animate-float">
                <Sparkles className="h-6 w-6" />
              </div>
              <div className="absolute -top-4 -left-4 bg-primary text-white p-4 rounded-lg shadow-lg animate-float" style={{animationDelay: '2s'}}>
                <MessageSquare className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent"></div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform offers everything you need to discover your strengths and plan your career path
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="feature-card p-6 border">
              <div className="bg-primary/10 text-primary rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Brain className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Quizzes</h3>
              <p className="text-muted-foreground">
                Personalized assessments that adapt to your profile and provide meaningful insights
              </p>
            </div>
            
            <div className="feature-card p-6 border">
              <div className="bg-secondary/10 text-secondary rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Feedback</h3>
              <p className="text-muted-foreground">
                Get detailed analysis of your strengths, weaknesses, and personalized career suggestions
              </p>
            </div>
            
            <div className="feature-card p-6 border">
              <div className="bg-accent/10 text-accent rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <LineChart className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Progress Tracking</h3>
              <p className="text-muted-foreground">
                Monitor your growth over time with detailed dashboards and progress reports
              </p>
            </div>
            
            <div className="feature-card p-6 border">
              <div className="bg-primary/10 text-primary rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Lock className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Platform</h3>
              <p className="text-muted-foreground">
                Your data is protected with advanced security measures and privacy controls
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Follow these simple steps to get personalized career insights
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="steps-card p-6 relative">
              <div className="absolute -top-3 -left-3 bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center font-bold border-4 border-background">
                1
              </div>
              <div className="pt-8">
                <PenTool className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Fill Your Info</h3>
                <p className="text-muted-foreground">
                  Provide basic information about your interests, strengths, and educational background
                </p>
              </div>
            </div>
            
            <div className="steps-card p-6 relative">
              <div className="absolute -top-3 -left-3 bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center font-bold border-4 border-background">
                2
              </div>
              <div className="pt-8">
                <Zap className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Payment</h3>
                <p className="text-muted-foreground">
                  Make a secure payment to unlock your personalized quiz session
                </p>
              </div>
            </div>
            
            <div className="steps-card p-6 relative">
              <div className="absolute -top-3 -left-3 bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center font-bold border-4 border-background">
                3
              </div>
              <div className="pt-8">
                <BookOpen className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Take the Quiz</h3>
                <p className="text-muted-foreground">
                  Complete your personalized assessment in a secure, distraction-free environment
                </p>
              </div>
            </div>
            
            <div className="steps-card p-6 relative">
              <div className="absolute -top-3 -left-3 bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center font-bold border-4 border-background">
                4
              </div>
              <div className="pt-8">
                <UserCheck className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Get Results</h3>
                <p className="text-muted-foreground">
                  Receive detailed AI-powered feedback and personalized career recommendations
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-10 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to discover your potential?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Join thousands of students who have found their ideal career path with Quiz Insight.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => navigate('/register')}
                className="font-semibold"
              >
                Create Account
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/login')}
                className="font-semibold"
              >
                Login
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Landing;
