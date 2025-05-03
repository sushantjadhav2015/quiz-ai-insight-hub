
import { Question } from '../types';
import { delay } from './utils';
import questionsData from '../data/questions.json';

// Helper function to ensure text fields don't exceed reasonable limits
const sanitizeText = (text: string, maxLength = 5000): string => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) : text;
};

export const getQuestions = async (): Promise<Question[]> => {
  await delay(400);
  return questionsData as Question[];
};

export const getQuestionsByCategory = async (categoryId: string): Promise<Question[]> => {
  await delay(400);
  return questionsData.filter(q => q.categoryId === categoryId) as Question[];
};

export const createQuestion = async (question: Omit<Question, 'id'>): Promise<Question> => {
  await delay(600);
  
  // Sanitize text fields before saving
  const sanitizedQuestion = {
    ...question,
    text: sanitizeText(question.text),
    options: question.options.map(opt => sanitizeText(opt, 1000)),
    explanation: question.explanation ? sanitizeText(question.explanation, 2000) : undefined
  };
  
  return {
    ...sanitizedQuestion,
    id: (questionsData.length + 1).toString()
  } as Question;
};

export const updateQuestion = async (question: Question): Promise<Question> => {
  await delay(500);
  
  // Sanitize text fields before updating
  const sanitizedQuestion = {
    ...question,
    text: sanitizeText(question.text),
    options: question.options.map(opt => sanitizeText(opt, 1000)),
    explanation: question.explanation ? sanitizeText(question.explanation, 2000) : undefined
  };
  
  return sanitizedQuestion;
};

export const deleteQuestion = async (id: string): Promise<void> => {
  await delay(500);
};
