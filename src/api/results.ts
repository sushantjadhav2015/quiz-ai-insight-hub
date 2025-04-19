
import { QuizResult } from '../types';
import { delay } from './utils';
import resultsData from '../data/results.json';

const convertResultData = (result: any): QuizResult => ({
  ...result,
  completedAt: new Date(result.completedAt)
});

export const getResultsByUser = async (userId: string): Promise<QuizResult[]> => {
  await delay(400);
  return resultsData
    .filter(r => r.userId === userId)
    .map(convertResultData);
};

export const getResultById = async (id: string): Promise<QuizResult> => {
  await delay(300);
  const result = resultsData.find(r => r.id === id);
  
  if (!result) {
    throw new Error("Result not found");
  }
  
  return convertResultData(result);
};

export const getAllResults = async (): Promise<QuizResult[]> => {
  await delay(400);
  return resultsData.map(convertResultData);
};
