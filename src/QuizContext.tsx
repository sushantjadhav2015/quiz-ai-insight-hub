import React, { createContext, useContext, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './AuthContext';
import { Category, Question, QuizInfo, QuizSession, QuizResult, Payment, Student } from './types';
import { toast } from './hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { 
  getCategories, 
  getQuestions, 
  createCategory, 
  updateCategory as updateCategoryApi, 
  deleteCategory as deleteCategoryApi,
  createQuestion,
  updateQuestion as updateQuestionApi,
  deleteQuestion as deleteQuestionApi,
  startQuiz as startQuizApi,
  submitQuiz as submitQuizApi,
  processPayment as processPaymentApi,
  getStudents
} from './api';

interface QuizContextType {
  categories: Category[];
  questions: Question[];
  quizInfo: QuizInfo | null;
  currentQuizSession: QuizSession | null;
  quizResults: QuizResult[];
  payments: Payment[];
  students: Student[];
  getStudentById: (id: string) => Student | undefined;
  setQuizInfo: (info: QuizInfo) => void;
  addCategory: (category: Omit<Category, 'id' | 'createdBy' | 'questionCount'>) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (categoryId: string) => void;
  addQuestion: (question: Omit<Question, 'id'>) => void;
  updateQuestion: (question: Question) => void;
  deleteQuestion: (questionId: string) => void;
  startQuiz: () => Promise<void>;
  submitQuiz: (answers: number[]) => Promise<QuizResult>;
  processPayment: () => Promise<Payment>;
  getQuizSessionSecurityStatus: () => { isSecure: boolean; message?: string };
}

const QuizContext = createContext<QuizContextType>({
  categories: [],
  questions: [],
  quizInfo: null,
  currentQuizSession: null,
  quizResults: [],
  payments: [],
  students: [],
  getStudentById: () => undefined,
  setQuizInfo: () => {},
  addCategory: () => {},
  updateCategory: () => {},
  deleteCategory: () => {},
  addQuestion: () => {},
  updateQuestion: () => {},
  deleteQuestion: () => {},
  startQuiz: async () => {},
  submitQuiz: async () => ({} as QuizResult),
  processPayment: async () => ({} as Payment),
  getQuizSessionSecurityStatus: () => ({ isSecure: true }),
});

export const useQuiz = () => useContext(QuizContext);

export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [quizInfo, setQuizInfo] = useState<QuizInfo | null>(null);
  const [currentQuizSession, setCurrentQuizSession] = useState<QuizSession | null>(null);
  
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 60000, // 1 minute
  });
  
  const { data: questions = [] } = useQuery({
    queryKey: ['questions'],
    queryFn: getQuestions,
    staleTime: 60000, // 1 minute
  });
  
  const { data: quizResults = [] } = useQuery({
    queryKey: ['results'],
    queryFn: () => {
      return Promise.resolve([]);
    },
    staleTime: 60000, // 1 minute
  });
  
  const { data: payments = [] } = useQuery({
    queryKey: ['payments'],
    queryFn: () => {
      return Promise.resolve([]);
    },
    staleTime: 60000, // 1 minute
  });
  
  const { data: students = [] } = useQuery({
    queryKey: ['students'],
    queryFn: getStudents,
    staleTime: 60000, // 1 minute
  });
  
  const getStudentById = (id: string) => {
    return students.find(student => student.id === id);
  };
  
  const getQuizSessionSecurityStatus = () => {
    if (!currentQuizSession) {
      return { isSecure: false, message: 'No active quiz session' };
    }
    
    if (currentQuizSession.completed) {
      return { isSecure: false, message: 'Quiz has already been completed' };
    }
    
    return { isSecure: true };
  };
  
  const addCategoryMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: (newCategory) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: "Category created",
        description: `"${newCategory.name}" has been created successfully.`
      });
    },
  });
  
  const updateCategoryMutation = useMutation({
    mutationFn: updateCategoryApi,
    onSuccess: (updatedCategory) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: "Category updated",
        description: `"${updatedCategory.name}" has been updated successfully.`
      });
    },
  });
  
  const deleteCategoryMutation = useMutation({
    mutationFn: deleteCategoryApi,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      
      const categoryToDelete = categories.find(c => c.id === variables);
      toast({
        title: "Category deleted",
        description: categoryToDelete 
          ? `"${categoryToDelete.name}" has been deleted.`
          : "Category has been deleted."
      });
    },
  });
  
  const addQuestionMutation = useMutation({
    mutationFn: createQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: "Question added",
        description: "The question has been added successfully."
      });
    },
  });
  
  const updateQuestionMutation = useMutation({
    mutationFn: updateQuestionApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      toast({
        title: "Question updated",
        description: "The question has been updated successfully."
      });
    },
  });
  
  const deleteQuestionMutation = useMutation({
    mutationFn: deleteQuestionApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: "Question deleted",
        description: "The question has been deleted successfully."
      });
    },
  });
  
  const startQuizMutation = useMutation({
    mutationFn: () => {
      if (!user || !quizInfo) {
        throw new Error('Quiz info not provided');
      }
      return startQuizApi(user.id, quizInfo);
    },
    onSuccess: (data) => {
      const newSession: QuizSession = {
        id: data.id,
        userId: user?.id || '',
        questions: data.questions,
        startTime: new Date(),
        completed: false,
      };
      
      setCurrentQuizSession(newSession);
      toast({
        title: "Quiz started",
        description: "Your personalized quiz is ready. Good luck!"
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Cannot start quiz",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const submitQuizMutation = useMutation({
    mutationFn: (answers: number[]) => {
      if (!user || !currentQuizSession) {
        throw new Error('No active quiz session');
      }
      return submitQuizApi(user.id, currentQuizSession.id, answers);
    },
    onSuccess: (result) => {
      setCurrentQuizSession(prev => prev ? { ...prev, completed: true } : null);
      
      queryClient.invalidateQueries({ queryKey: ['results'] });
      toast({
        title: "Quiz completed",
        description: "Your results are ready. Check out your personalized feedback!"
      });
    },
  });
  
  const paymentMutation = useMutation({
    mutationFn: () => {
      if (!user) {
        throw new Error('User not authenticated');
      }
      return processPaymentApi(user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      toast({
        title: "Payment successful",
        description: "You can now start your quiz!"
      });
    },
  });
  
  const addCategory = (category: Omit<Category, 'id' | 'createdBy' | 'questionCount'>) => {
    addCategoryMutation.mutate(category);
  };
  
  const updateCategory = (category: Category) => {
    updateCategoryMutation.mutate(category);
  };
  
  const deleteCategory = (categoryId: string) => {
    deleteCategoryMutation.mutate(categoryId);
  };
  
  const addQuestion = (question: Omit<Question, 'id'>) => {
    addQuestionMutation.mutate(question);
  };
  
  const updateQuestion = (question: Question) => {
    updateQuestionMutation.mutate(question);
  };
  
  const deleteQuestion = (questionId: string) => {
    deleteQuestionMutation.mutate(questionId);
  };
  
  const startQuiz = async () => {
    await startQuizMutation.mutateAsync();
  };
  
  const submitQuiz = async (answers: number[]) => {
    return await submitQuizMutation.mutateAsync(answers);
  };
  
  const processPayment = async () => {
    return await paymentMutation.mutateAsync();
  };
  
  React.useEffect(() => {
    const handleVisibilityChange = () => {
      if (currentQuizSession && !currentQuizSession.completed && document.hidden) {
        toast({
          title: "Warning",
          description: "Leaving the quiz page will reset your progress!",
          variant: "destructive",
        });
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [currentQuizSession]);
  
  const value = {
    categories,
    questions,
    quizInfo,
    currentQuizSession,
    quizResults,
    payments,
    students,
    setQuizInfo,
    addCategory,
    updateCategory,
    deleteCategory,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    startQuiz,
    submitQuiz,
    processPayment,
    getQuizSessionSecurityStatus,
    getStudentById,
  };
  
  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};
