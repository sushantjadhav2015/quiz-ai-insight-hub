
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { startQuiz as startQuizApi, submitQuiz as submitQuizApi } from '../api';
import { QuizSession, QuizInfo, QuizResult } from '../types';
import { toast } from './use-toast';

export const useQuizSession = (userId: string | undefined) => {
  const [currentQuizSession, setCurrentQuizSession] = useState<QuizSession | null>(null);
  const [quizInfo, setQuizInfo] = useState<QuizInfo | null>(null);

  const startQuizMutation = useMutation({
    mutationFn: () => {
      if (!userId || !quizInfo) {
        throw new Error('Quiz info not provided');
      }
      return startQuizApi(userId, quizInfo);
    },
    onSuccess: (data) => {
      const newSession: QuizSession = {
        id: data.id,
        userId: userId || '',
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
      if (!userId || !currentQuizSession) {
        throw new Error('No active quiz session');
      }
      return submitQuizApi(userId, currentQuizSession.id, answers);
    },
    onSuccess: () => {
      setCurrentQuizSession(prev => prev ? { ...prev, completed: true } : null);
      toast({
        title: "Quiz completed",
        description: "Your results are ready. Check out your personalized feedback!"
      });
    },
  });

  const startQuiz = async () => {
    await startQuizMutation.mutateAsync();
  };

  const submitQuiz = async (answers: number[]): Promise<QuizResult> => {
    return await submitQuizMutation.mutateAsync(answers);
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

  return {
    quizInfo,
    currentQuizSession,
    setQuizInfo,
    startQuiz,
    submitQuiz,
    getQuizSessionSecurityStatus,
  };
};
