
import { Question } from '../types';
import { delay } from './utils';
import questionsData from '../data/questions.json';

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
  
  return {
    ...question,
    id: (questionsData.length + 1).toString()
  } as Question;
};

export const updateQuestion = async (question: Question): Promise<Question> => {
  await delay(500);
  return question;
};

export const deleteQuestion = async (id: string): Promise<void> => {
  await delay(500);
};
