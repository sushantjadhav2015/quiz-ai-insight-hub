
import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';
import { QuizInfo, QuizSession, QuizResult, Payment, Student, Category, Question } from './types';
import { useCategories } from './hooks/useCategories';
import { useQuestions } from './hooks/useQuestions';
import { useQuizSession } from './hooks/useQuizSession';
import { usePayments } from './hooks/usePayments';
import { useStudents } from './hooks/useStudents';

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

const QuizContext = createContext<QuizContextType>({} as QuizContextType);

export const useQuiz = () => useContext(QuizContext);

export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories();
  const { questions, addQuestion, updateQuestion, deleteQuestion } = useQuestions();
  const { quizInfo, currentQuizSession, setQuizInfo, startQuiz, submitQuiz, getQuizSessionSecurityStatus } = useQuizSession(user?.id);
  const { payments, processPayment } = usePayments(user?.id);
  const { students, getStudentById } = useStudents();
  const quizResults: QuizResult[] = [];

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
