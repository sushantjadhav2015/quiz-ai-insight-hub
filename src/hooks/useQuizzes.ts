
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Quiz } from '../types/quiz';
import { getQuizzes, createQuiz, updateQuiz, deleteQuiz } from '../api/quizzes';
import { toast } from './use-toast';

export const useQuizzes = () => {
  const queryClient = useQueryClient();
  
  const { data: quizzes = [], isLoading } = useQuery({
    queryKey: ['quizzes'],
    queryFn: getQuizzes
  });

  // Create quiz mutation
  const { mutate: addQuiz } = useMutation({
    mutationFn: (quiz: Omit<Quiz, 'id' | 'createdAt' | 'updatedAt'>) => createQuiz(quiz),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
      toast({
        title: 'Quiz created successfully',
        description: 'The quiz has been added to the system',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'There was a problem creating the quiz',
        variant: 'destructive',
      });
    },
  });

  // Update quiz mutation
  const { mutate: editQuiz } = useMutation({
    mutationFn: (quiz: Quiz) => updateQuiz(quiz),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
      toast({
        title: 'Quiz updated successfully',
        description: 'The quiz has been updated',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'There was a problem updating the quiz',
        variant: 'destructive',
      });
    },
  });

  // Delete quiz mutation
  const { mutate: removeQuiz } = useMutation({
    mutationFn: (id: string) => deleteQuiz(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
      toast({
        title: 'Quiz deleted successfully',
        description: 'The quiz has been removed from the system',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'There was a problem deleting the quiz',
        variant: 'destructive',
      });
    },
  });

  return {
    quizzes,
    isLoading,
    addQuiz,
    editQuiz,
    removeQuiz
  };
};
