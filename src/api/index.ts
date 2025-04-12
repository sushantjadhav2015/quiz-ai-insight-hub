
import usersData from '../data/users.json';
import categoriesData from '../data/categories.json';
import questionsData from '../data/questions.json';
import resultsData from '../data/results.json';
import paymentsData from '../data/payments.json';
import { User, Student, Category, Question, QuizResult, Payment, QuizInfo } from '../types';

// Helper for simulating API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to convert string dates to Date objects for Payments
const convertPaymentData = (payment: any): Payment => ({
  ...payment,
  createdAt: new Date(payment.createdAt),
  status: payment.status as 'pending' | 'completed' | 'failed'
});

// Helper to convert string dates to Date objects for Quiz Results
const convertResultData = (result: any): QuizResult => ({
  ...result,
  completedAt: new Date(result.completedAt)
});

// Authentication API
export const loginUser = async (email: string, password: string): Promise<User> => {
  await delay(500); // Simulate network delay
  
  const user = usersData.find(u => u.email === email);
  
  if (user && password === "password") {
    return user as User;
  }
  
  throw new Error("Invalid credentials");
};

export const registerUser = async (name: string, email: string, password: string): Promise<User> => {
  await delay(700); // Simulate network delay
  
  // Check if email already exists
  if (usersData.some(u => u.email === email)) {
    throw new Error("Email already registered");
  }
  
  // In a real API, we would create a new user in the database
  // For our mock API, we'll just return a new user object
  const newUser: Student = {
    id: (usersData.length + 1).toString(),
    email,
    name,
    role: "student",
    quizHistory: [],
    paymentHistory: []
  };
  
  return newUser;
};

export const updateUserProfile = async (userId: string, userData: Partial<Student>): Promise<User> => {
  await delay(600); // Simulate network delay
  
  // Find the user
  const user = usersData.find(u => u.id === userId);
  
  if (!user) {
    throw new Error("User not found");
  }
  
  // In a real API, we would update the user in the database
  // For our mock API, we'll just return the updated user object
  return { ...user, ...userData } as User;
};

// Categories API
export const getCategories = async (): Promise<Category[]> => {
  await delay(400);
  return categoriesData as Category[];
};

export const getCategoryById = async (id: string): Promise<Category> => {
  await delay(300);
  const category = categoriesData.find(c => c.id === id);
  
  if (!category) {
    throw new Error("Category not found");
  }
  
  return category as Category;
};

export const createCategory = async (category: Omit<Category, 'id' | 'createdBy' | 'questionCount'>): Promise<Category> => {
  await delay(600);
  
  // In a real API, we would create the category in the database
  return {
    ...category,
    id: (categoriesData.length + 1).toString(),
    createdBy: "1", // Assuming admin
    questionCount: 0
  } as Category;
};

export const updateCategory = async (category: Category): Promise<Category> => {
  await delay(500);
  
  // In a real API, we would update the category in the database
  return category;
};

export const deleteCategory = async (id: string): Promise<void> => {
  await delay(500);
  // In a real API, we would delete the category from the database
};

// Questions API
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
  
  // In a real API, we would create the question in the database
  return {
    ...question,
    id: (questionsData.length + 1).toString()
  } as Question;
};

export const updateQuestion = async (question: Question): Promise<Question> => {
  await delay(500);
  
  // In a real API, we would update the question in the database
  return question;
};

export const deleteQuestion = async (id: string): Promise<void> => {
  await delay(500);
  // In a real API, we would delete the question from the database
};

// Quiz API
export const startQuiz = async (userId: string, quizInfo: QuizInfo): Promise<{id: string, questions: Question[]}> => {
  await delay(800);
  
  // Get questions for the quiz
  const questions = await getQuizQuestions(quizInfo);
  
  // In a real API, we would create a quiz session in the database
  return {
    id: Math.floor(Math.random() * 10000).toString(),
    questions
  };
};

export const submitQuiz = async (userId: string, quizSessionId: string, answers: number[]): Promise<QuizResult> => {
  await delay(1000);
  
  // In a real API, we would calculate the score and generate feedback
  const result: QuizResult = {
    id: (resultsData.length + 1).toString(),
    userId,
    quizSessionId,
    score: Math.floor(Math.random() * 30) + 70, // Random score between 70-100
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

// Helper function to select questions for a quiz
const getQuizQuestions = async (quizInfo: QuizInfo): Promise<Question[]> => {
  const allQuestions = await getQuestions();
  const selectedQuestions: Question[] = [];
  
  // Get questions from different categories
  const categories = ["1", "2", "3", "4", "5"];
  
  for (const categoryId of categories) {
    const categoryQuestions = allQuestions.filter(q => q.categoryId === categoryId);
    if (categoryQuestions.length > 0) {
      // Add up to 2 questions from each category
      selectedQuestions.push(categoryQuestions[0]);
      if (categoryQuestions.length > 1) {
        selectedQuestions.push(categoryQuestions[1]);
      }
    }
  }
  
  return selectedQuestions;
};

// Payment API
export const processPayment = async (userId: string): Promise<Payment> => {
  await delay(1200);
  
  // In a real API, we would process the payment
  const payment: Payment = {
    id: (paymentsData.length + 1).toString(),
    userId,
    amount: 9.99,
    status: "completed",
    createdAt: new Date()
  };
  
  return payment;
};

export const getPaymentsByUser = async (userId: string): Promise<Payment[]> => {
  await delay(400);
  return paymentsData
    .filter(p => p.userId === userId)
    .map(convertPaymentData);
};

export const getAllPayments = async (): Promise<Payment[]> => {
  await delay(400);
  return paymentsData.map(convertPaymentData);
};

// Results API
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
