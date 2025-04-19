
import { Question, QuizInfo, QuizResult } from '../types';
import { delay } from './utils';
import resultsData from '../data/results.json';
import { getQuestions } from './questions';

export const startQuiz = async (userId: string, quizInfo: QuizInfo): Promise<{id: string, questions: Question[]}> => {
  await delay(800);
  
  const questions = await getQuizQuestions(quizInfo);
  
  return {
    id: Math.floor(Math.random() * 10000).toString(),
    questions
  };
};

export const submitQuiz = async (userId: string, quizSessionId: string, answers: number[]): Promise<QuizResult> => {
  await delay(1000);
  
  const result: QuizResult = {
    id: (resultsData.length + 1).toString(),
    userId,
    quizSessionId,
    score: Math.floor(Math.random() * 30) + 70,
    totalQuestions: answers.length,
    completedAt: new Date(),
    feedback: {
      strengths: ["Critical analysis", "Problem solving"],
      weakAreas: ["Creative expression", "Verbal communication"],
      personalitySummary: "You have a sharp analytical mind with excellent problem-solving abilities and attention to detail.",
      careerSuggestions: ["Engineering", "Systems Analysis", "Quality Assurance", "Scientific Research", "Technical Writing"]
    }
  };
  
  return result;
};

const getQuizQuestions = async (quizInfo: QuizInfo): Promise<Question[]> => {
  const allQuestions = await getQuestions();
  const selectedQuestions: Question[] = [];
  
  const categories = ["1", "2", "3", "4", "5"];
  
  for (const categoryId of categories) {
    const categoryQuestions = allQuestions.filter(q => q.categoryId === categoryId);
    if (categoryQuestions.length > 0) {
      selectedQuestions.push(categoryQuestions[0]);
      if (categoryQuestions.length > 1) {
        selectedQuestions.push(categoryQuestions[1]);
      }
    }
  }
  
  return selectedQuestions;
};
