
export type UserRole = 'admin' | 'student';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface Student extends User {
  role: 'student';
  age?: number;
  interests?: string[];
  strengths?: string[];
  weakSubjects?: string[];
  quizHistory?: QuizResult[];
  paymentHistory?: Payment[];
}

export interface Admin extends User {
  role: 'admin';
}

export interface Category {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  questionCount: number;
}

export interface Question {
  id: string;
  categoryId: string;
  text: string;
  options: string[];
  correctOption: number;
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface QuizInfo {
  age: number;
  interests: string[];
  strengths: string[];
  weakSubjects: string[];
}

export interface QuizSession {
  id: string;
  userId: string;
  questions: Question[];
  startTime: Date;
  completed: boolean;
  answers?: number[];
}

export interface QuizResult {
  id: string;
  userId: string;
  quizSessionId: string;
  score: number;
  totalQuestions: number;
  completedAt: Date;
  feedback: {
    strengths: string[];
    weakAreas: string[];
    personalitySummary: string;
    careerSuggestions: string[];
  };
}

export interface Payment {
  id: string;
  userId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
  quizSessionId?: string;
}
