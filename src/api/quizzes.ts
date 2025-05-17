
import { Quiz } from '../types/quiz';
import { delay } from './utils';

// Mock data
const quizzesData: Quiz[] = [
  {
    id: "1",
    name: "General Aptitude Test",
    price: 29.99,
    description: "A comprehensive assessment of logical reasoning and problem-solving skills",
    categoryDistribution: [
      { categoryId: "1", percentage: 40 },
      { categoryId: "2", percentage: 60 }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "2",
    name: "Career Path Finder",
    price: 49.99,
    description: "Discover your ideal career path based on your interests and personality traits",
    categoryDistribution: [
      { categoryId: "3", percentage: 50 },
      { categoryId: "4", percentage: 30 },
      { categoryId: "5", percentage: 20 }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const getQuizzes = async (): Promise<Quiz[]> => {
  await delay(400);
  return [...quizzesData];
};

export const getQuizById = async (id: string): Promise<Quiz> => {
  await delay(300);
  const quiz = quizzesData.find(q => q.id === id);
  
  if (!quiz) {
    throw new Error("Quiz not found");
  }
  
  return {...quiz};
};

export const createQuiz = async (quiz: Omit<Quiz, 'id' | 'createdAt' | 'updatedAt'>): Promise<Quiz> => {
  await delay(600);
  
  const newQuiz: Quiz = {
    ...quiz,
    id: (quizzesData.length + 1).toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  return newQuiz;
};

export const updateQuiz = async (quiz: Quiz): Promise<Quiz> => {
  await delay(500);
  
  const updatedQuiz = {
    ...quiz,
    updatedAt: new Date().toISOString()
  };
  
  return updatedQuiz;
};

export const deleteQuiz = async (id: string): Promise<void> => {
  await delay(500);
  // In a real app, this would delete from a database
};
