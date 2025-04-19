
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getQuestions, createQuestion, updateQuestion as updateQuestionApi, deleteQuestion as deleteQuestionApi } from '../api';
import { Question } from '../types';
import { toast } from './use-toast';

export const useQuestions = () => {
  const queryClient = useQueryClient();

  const { data: questions = [] } = useQuery({
    queryKey: ['questions'],
    queryFn: getQuestions,
    staleTime: 60000,
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

  const addQuestion = (question: Omit<Question, 'id'>) => {
    addQuestionMutation.mutate(question);
  };

  const updateQuestion = (question: Question) => {
    updateQuestionMutation.mutate(question);
  };

  const deleteQuestion = (questionId: string) => {
    deleteQuestionMutation.mutate(questionId);
  };

  return {
    questions,
    addQuestion,
    updateQuestion,
    deleteQuestion,
  };
};
