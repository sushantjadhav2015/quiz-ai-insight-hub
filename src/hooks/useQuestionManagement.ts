
import { useState } from 'react';
import { Question } from '@/types';

interface QuestionFormState {
  text: string;
  categoryId: string;
  options: string[];
  correctOption: number;
  difficulty: 'easy' | 'medium' | 'hard';
  explanation: string;
}

export const useQuestionManagement = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  
  const [newQuestion, setNewQuestion] = useState<QuestionFormState>({
    text: '',
    categoryId: '',
    options: ['', '', '', ''],
    correctOption: 0,
    difficulty: 'medium',
    explanation: '',
  });

  const resetForm = () => {
    setNewQuestion({
      text: '',
      categoryId: selectedCategory !== 'all' ? selectedCategory : '',
      options: ['', '', '', ''],
      correctOption: 0,
      difficulty: 'medium',
      explanation: '',
    });
    setIsEditing(false);
    setEditingQuestionId(null);
  };

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions[index] = value;
    setNewQuestion({ ...newQuestion, options: updatedOptions });
  };

  const handleQuestionChange = (field: string, value: any) => {
    setNewQuestion({ ...newQuestion, [field]: value });
  };

  const handleEditQuestion = (question: Question) => {
    setNewQuestion({
      text: question.text,
      categoryId: question.categoryId,
      options: [...question.options],
      correctOption: question.correctOption,
      difficulty: question.difficulty,
      explanation: question.explanation || '',
    });
    setIsEditing(true);
    setEditingQuestionId(question.id);
    setIsModalOpen(true);
  };

  return {
    filters: {
      selectedCategory,
      setSelectedCategory,
      searchQuery,
      setSearchQuery,
      selectedDifficulty,
      setSelectedDifficulty,
      currentPage,
      setCurrentPage,
    },
    form: {
      newQuestion,
      isEditing,
      editingQuestionId,
      isModalOpen,
      setIsModalOpen,
      handleOptionChange,
      handleQuestionChange,
      handleEditQuestion,
      resetForm,
    },
  };
};
