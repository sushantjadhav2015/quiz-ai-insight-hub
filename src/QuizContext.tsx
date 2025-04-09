import React, { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';
import { Category, Question, QuizInfo, QuizSession, QuizResult, Payment, Student } from './types';
import { toast } from './hooks/use-toast';
import { useNavigate } from 'react-router-dom';

// Sample quiz categories
const MOCK_CATEGORIES: Category[] = [
  {
    id: '1',
    name: 'Aptitude',
    description: 'Assess your logical and numerical abilities',
    createdBy: '1',
    questionCount: 20,
  },
  {
    id: '2',
    name: 'Logical Reasoning',
    description: 'Test your critical thinking and problem-solving skills',
    createdBy: '1',
    questionCount: 15,
  },
  {
    id: '3',
    name: 'Personality',
    description: 'Discover your personality traits and preferences',
    createdBy: '1',
    questionCount: 25,
  },
  {
    id: '4',
    name: 'Subject Interest',
    description: 'Find out which subjects align with your interests',
    createdBy: '1',
    questionCount: 18,
  },
  {
    id: '5',
    name: 'Situational Judgement',
    description: 'Evaluate your decision-making in real-world scenarios',
    createdBy: '1',
    questionCount: 12,
  },
];

// Sample questions
const MOCK_QUESTIONS: Question[] = [
  {
    id: '1',
    categoryId: '1',
    text: 'If 5x + 3 = 18, what is the value of x?',
    options: ['2', '3', '4', '5'],
    correctOption: 1,
    difficulty: 'medium',
  },
  {
    id: '2',
    categoryId: '1',
    text: 'A train traveling at 60 mph takes 2 hours to reach its destination. How far is the destination?',
    options: ['30 miles', '60 miles', '90 miles', '120 miles'],
    correctOption: 3,
    difficulty: 'easy',
  },
  {
    id: '3',
    categoryId: '2',
    text: 'Complete the sequence: 2, 4, 8, 16, __',
    options: ['24', '32', '36', '64'],
    correctOption: 1,
    difficulty: 'easy',
  },
  {
    id: '4',
    categoryId: '2',
    text: 'If all roses are flowers and some flowers fade quickly, which statement must be true?',
    options: [
      'All roses fade quickly',
      'Some roses fade quickly',
      'No roses fade quickly',
      'None of the above'
    ],
    correctOption: 1,
    difficulty: 'medium',
  },
  {
    id: '5',
    categoryId: '3',
    text: 'In a social setting, you usually prefer to:',
    options: [
      'Meet new people and start conversations',
      'Talk with a few people you already know',
      'Observe the interactions of others',
      'Avoid social gatherings when possible'
    ],
    correctOption: 0,
    difficulty: 'easy',
  },
  {
    id: '6',
    categoryId: '3',
    text: 'When facing a difficult problem, your first instinct is to:',
    options: [
      'Analyze it methodically step by step',
      'Look for creative, unconventional solutions',
      'Consult others for their perspective',
      'Trust your intuition and feelings about it'
    ],
    correctOption: 0,
    difficulty: 'easy',
  },
  {
    id: '7',
    categoryId: '4',
    text: 'Which of these activities would you most enjoy as a career?',
    options: [
      'Conducting scientific research',
      'Creating artistic works',
      'Managing a team of people',
      'Working with technology and programming'
    ],
    correctOption: 0,
    difficulty: 'easy',
  },
  {
    id: '8',
    categoryId: '4',
    text: 'Which subject do you find most engaging to learn about?',
    options: [
      'History and culture',
      'Mathematics and logic',
      'Literature and language',
      'Biology and natural sciences'
    ],
    correctOption: 0,
    difficulty: 'easy',
  },
  {
    id: '9',
    categoryId: '5',
    text: 'Your team member consistently submits work late, affecting the project. What would you do?',
    options: [
      'Report them to management immediately',
      'Discuss the issue privately with them first',
      'Take over their responsibilities without saying anything',
      'Ask other team members how to handle it'
    ],
    correctOption: 1,
    difficulty: 'medium',
  },
  {
    id: '10',
    categoryId: '5',
    text: 'You notice a colleague taking office supplies for personal use. How would you respond?',
    options: [
      'Confront them directly in front of others',
      'Anonymously report the behavior',
      'Talk to them privately about your concerns',
      'Ignore it as it doesn\'t affect you directly'
    ],
    correctOption: 2,
    difficulty: 'medium',
  },
];

// Sample student data for admin panel
const MOCK_STUDENTS: Student[] = [
  {
    id: '1',
    email: 'student1@example.com',
    name: 'Jane Smith',
    role: 'student',
    age: 19,
    interests: ['Science', 'Technology'],
    strengths: ['Critical thinking', 'Problem solving'],
    weakSubjects: ['History', 'Art'],
    quizHistory: [],
    paymentHistory: [],
  },
  {
    id: '2',
    email: 'student2@example.com',
    name: 'John Doe',
    role: 'student',
    age: 22,
    interests: ['Business', 'Economics'],
    strengths: ['Communication', 'Leadership'],
    weakSubjects: ['Mathematics', 'Physics'],
    quizHistory: [],
    paymentHistory: [],
  },
  {
    id: '3',
    email: 'student3@example.com',
    name: 'Alex Johnson',
    role: 'student',
    age: 20,
    interests: ['Art', 'Literature'],
    strengths: ['Creativity', 'Writing'],
    weakSubjects: ['Chemistry', 'Biology'],
    quizHistory: [],
    paymentHistory: [],
  },
  {
    id: '4',
    email: 'student4@example.com',
    name: 'Emily Chen',
    role: 'student',
    age: 21,
    interests: ['Engineering', 'Design'],
    strengths: ['Analytical thinking', 'Mathematics'],
    weakSubjects: ['Literature', 'Geography'],
    quizHistory: [],
    paymentHistory: [],
  },
  {
    id: '5',
    email: 'student5@example.com',
    name: 'Michael Brown',
    role: 'student',
    age: 23,
    interests: ['Psychology', 'Sociology'],
    strengths: ['Research', 'Analysis'],
    weakSubjects: ['Economics', 'Chemistry'],
    quizHistory: [],
    paymentHistory: [],
  },
];

// Sample payment data
const MOCK_PAYMENTS: Payment[] = [
  {
    id: '1',
    userId: '1',
    amount: 9.99,
    status: 'completed',
    createdAt: new Date(2025, 3, 1),
    quizSessionId: '101',
  },
  {
    id: '2',
    userId: '2',
    amount: 9.99,
    status: 'completed',
    createdAt: new Date(2025, 3, 2),
    quizSessionId: '102',
  },
  {
    id: '3',
    userId: '3',
    amount: 9.99,
    status: 'completed',
    createdAt: new Date(2025, 3, 3),
    quizSessionId: '103',
  },
  {
    id: '4',
    userId: '1',
    amount: 9.99,
    status: 'completed',
    createdAt: new Date(2025, 3, 5),
    quizSessionId: '104',
  },
  {
    id: '5',
    userId: '4',
    amount: 9.99,
    status: 'completed',
    createdAt: new Date(2025, 3, 7),
  },
  {
    id: '6',
    userId: '5',
    amount: 9.99,
    status: 'pending',
    createdAt: new Date(2025, 3, 8),
  },
  {
    id: '7',
    userId: '2',
    amount: 9.99,
    status: 'failed',
    createdAt: new Date(2025, 3, 8),
  },
];

// Sample quiz results
const MOCK_RESULTS: QuizResult[] = [
  {
    id: '1',
    userId: '1',
    quizSessionId: '101',
    score: 85,
    totalQuestions: 10,
    completedAt: new Date(2025, 3, 1),
    feedback: {
      strengths: ['Numerical reasoning', 'Logical thinking'],
      weakAreas: ['Verbal comprehension', 'Abstract reasoning'],
      personalitySummary: 'You appear to be analytical and detail-oriented, with a methodical approach to problem-solving.',
      careerSuggestions: ['Data Science', 'Software Engineering', 'Actuarial Science', 'Financial Analysis', 'Research'],
    },
  },
  {
    id: '2',
    userId: '2',
    quizSessionId: '102',
    score: 78,
    totalQuestions: 10,
    completedAt: new Date(2025, 3, 2),
    feedback: {
      strengths: ['Communication', 'Social awareness'],
      weakAreas: ['Technical analysis', 'Mathematical concepts'],
      personalitySummary: 'You exhibit strong interpersonal skills and emotional intelligence, with a natural ability to connect with others.',
      careerSuggestions: ['Marketing', 'Human Resources', 'Public Relations', 'Sales', 'Teaching'],
    },
  },
  {
    id: '3',
    userId: '3',
    quizSessionId: '103',
    score: 92,
    totalQuestions: 10,
    completedAt: new Date(2025, 3, 3),
    feedback: {
      strengths: ['Creative thinking', 'Pattern recognition'],
      weakAreas: ['Structured analysis', 'Quantitative reasoning'],
      personalitySummary: 'You demonstrate exceptional creative abilities and out-of-the-box thinking, with a talent for innovation.',
      careerSuggestions: ['Graphic Design', 'Content Creation', 'Product Design', 'Architecture', 'Art Direction'],
    },
  },
  {
    id: '4',
    userId: '1',
    quizSessionId: '104',
    score: 88,
    totalQuestions: 10,
    completedAt: new Date(2025, 3, 5),
    feedback: {
      strengths: ['Critical analysis', 'Problem solving'],
      weakAreas: ['Creative expression', 'Verbal communication'],
      personalitySummary: 'You have a sharp analytical mind with excellent problem-solving abilities and attention to detail.',
      careerSuggestions: ['Engineering', 'Systems Analysis', 'Quality Assurance', 'Scientific Research', 'Technical Writing'],
    },
  },
];

interface QuizContextType {
  categories: Category[];
  questions: Question[];
  quizInfo: QuizInfo | null;
  currentQuizSession: QuizSession | null;
  quizResults: QuizResult[];
  payments: Payment[];
  students: Student[];
  getStudentById: (id: string) => Student | undefined;
  setQuizInfo: (info: QuizInfo) => void;
  addCategory: (category: Omit<Category, 'id' | 'createdBy' | 'questionCount'>) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (categoryId: string) => void;
  addQuestion: (question: Omit<Question, 'id'>) => void;
  updateQuestion: (question: Question) => void;
  deleteQuestion: (questionId: string) => void;
  startQuiz: () => Promise<void>;
  submitQuiz: (answers: number[]) => Promise<QuizResult>;
  processPayment: () => Promise<Payment>;
  getQuizSessionSecurityStatus: () => { isSecure: boolean; message?: string };
}

const QuizContext = createContext<QuizContextType>({
  categories: [],
  questions: [],
  quizInfo: null,
  currentQuizSession: null,
  quizResults: [],
  payments: [],
  students: [],
  getStudentById: () => undefined,
  setQuizInfo: () => {},
  addCategory: () => {},
  updateCategory: () => {},
  deleteCategory: () => {},
  addQuestion: () => {},
  updateQuestion: () => {},
  deleteQuestion: () => {},
  startQuiz: async () => {},
  submitQuiz: async () => ({} as QuizResult),
  processPayment: async () => ({} as Payment),
  getQuizSessionSecurityStatus: () => ({ isSecure: true }),
});

export const useQuiz = () => useContext(QuizContext);

export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  
  // State for quiz data
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const [questions, setQuestions] = useState<Question[]>(MOCK_QUESTIONS);
  const [quizInfo, setQuizInfo] = useState<QuizInfo | null>(null);
  const [currentQuizSession, setCurrentQuizSession] = useState<QuizSession | null>(null);
  const [quizResults, setQuizResults] = useState<QuizResult[]>(MOCK_RESULTS);
  const [payments, setPayments] = useState<Payment[]>(MOCK_PAYMENTS);
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
  
  // Get student by ID
  const getStudentById = (id: string) => {
    return students.find(student => student.id === id);
  };
  
  // Security check for quiz sessions
  const getQuizSessionSecurityStatus = () => {
    if (!currentQuizSession) {
      return { isSecure: false, message: 'No active quiz session' };
    }
    
    // Check if quiz has already been completed
    if (currentQuizSession.completed) {
      return { isSecure: false, message: 'Quiz has already been completed' };
    }
    
    return { isSecure: true };
  };
  
  // Category management functions
  const addCategory = (categoryData: Omit<Category, 'id' | 'createdBy' | 'questionCount'>) => {
    if (!user) return;
    
    const newCategory: Category = {
      ...categoryData,
      id: (categories.length + 1).toString(),
      createdBy: user.id,
      questionCount: 0,
    };
    
    setCategories([...categories, newCategory]);
    toast({
      title: "Category created",
      description: `"${newCategory.name}" has been created successfully.`
    });
  };
  
  const updateCategory = (updatedCategory: Category) => {
    setCategories(categories.map(cat => 
      cat.id === updatedCategory.id ? updatedCategory : cat
    ));
    
    toast({
      title: "Category updated",
      description: `"${updatedCategory.name}" has been updated successfully.`
    });
  };
  
  const deleteCategory = (categoryId: string) => {
    // Delete related questions first
    setQuestions(questions.filter(q => q.categoryId !== categoryId));
    
    // Then delete the category
    const categoryToDelete = categories.find(c => c.id === categoryId);
    setCategories(categories.filter(c => c.id !== categoryId));
    
    toast({
      title: "Category deleted",
      description: categoryToDelete 
        ? `"${categoryToDelete.name}" has been deleted.`
        : "Category has been deleted."
    });
  };
  
  // Question management functions
  const addQuestion = (questionData: Omit<Question, 'id'>) => {
    const newQuestion: Question = {
      ...questionData,
      id: (questions.length + 1).toString(),
    };
    
    setQuestions([...questions, newQuestion]);
    
    // Update question count for the category
    const categoryIndex = categories.findIndex(c => c.id === questionData.categoryId);
    if (categoryIndex >= 0) {
      const updatedCategories = [...categories];
      updatedCategories[categoryIndex] = {
        ...updatedCategories[categoryIndex],
        questionCount: updatedCategories[categoryIndex].questionCount + 1,
      };
      setCategories(updatedCategories);
    }
    
    toast({
      title: "Question added",
      description: "The question has been added successfully."
    });
  };
  
  const updateQuestion = (updatedQuestion: Question) => {
    setQuestions(questions.map(q => 
      q.id === updatedQuestion.id ? updatedQuestion : q
    ));
    
    toast({
      title: "Question updated",
      description: "The question has been updated successfully."
    });
  };
  
  const deleteQuestion = (questionId: string) => {
    const questionToDelete = questions.find(q => q.id === questionId);
    
    if (questionToDelete) {
      // Update question count for the category
      const categoryIndex = categories.findIndex(c => c.id === questionToDelete.categoryId);
      if (categoryIndex >= 0) {
        const updatedCategories = [...categories];
        updatedCategories[categoryIndex] = {
          ...updatedCategories[categoryIndex],
          questionCount: Math.max(0, updatedCategories[categoryIndex].questionCount - 1),
        };
        setCategories(updatedCategories);
      }
      
      // Delete the question
      setQuestions(questions.filter(q => q.id !== questionId));
      
      toast({
        title: "Question deleted",
        description: "The question has been deleted successfully."
      });
    }
  };
  
  // Quiz functionality
  const startQuiz = async () => {
    if (!user || !quizInfo) {
      toast({
        title: "Cannot start quiz",
        description: "Please provide your information first.",
        variant: "destructive",
      });
      throw new Error('Quiz info not provided');
    }
    
    // Check if user has an active payment
    const hasActivePayment = payments.some(p => 
      p.userId === user.id && 
      p.status === 'completed' && 
      !p.quizSessionId
    );
    
    if (!hasActivePayment) {
      toast({
        title: "Payment required",
        description: "Please complete payment before starting the quiz.",
        variant: "destructive",
      });
      throw new Error('Payment required');
    }
    
    // Generate a quiz with 10 questions 
    // In a real app, you'd use the user's quizInfo to personalize this
    const selectedQuestions = selectQuestionsForQuiz(quizInfo);
    
    const newSession: QuizSession = {
      id: (Math.random() * 10000).toFixed(0),
      userId: user.id,
      questions: selectedQuestions,
      startTime: new Date(),
      completed: false,
    };
    
    setCurrentQuizSession(newSession);
    
    // Mark the payment as used
    const paymentIndex = payments.findIndex(p => 
      p.userId === user.id && 
      p.status === 'completed' && 
      !p.quizSessionId
    );
    
    if (paymentIndex >= 0) {
      const updatedPayments = [...payments];
      updatedPayments[paymentIndex] = {
        ...updatedPayments[paymentIndex],
        quizSessionId: newSession.id,
      };
      setPayments(updatedPayments);
    }
    
    toast({
      title: "Quiz started",
      description: "Your personalized quiz is ready. Good luck!"
    });
  };
  
  // Helper function to select questions for a quiz based on user info
  const selectQuestionsForQuiz = (info: QuizInfo) => {
    // In a real app, you'd use a more sophisticated algorithm
    // that factors in the user's interests, strengths, etc.
    
    // For now, we'll just select a mix of questions from different categories
    const selectedQuestions: Question[] = [];
    
    // Add aptitude and reasoning questions
    const aptitudeQuestions = questions.filter(q => q.categoryId === '1');
    const reasoningQuestions = questions.filter(q => q.categoryId === '2');
    const personalityQuestions = questions.filter(q => q.categoryId === '3');
    const interestQuestions = questions.filter(q => q.categoryId === '4');
    const situationalQuestions = questions.filter(q => q.categoryId === '5');
    
    // Create a balanced mix
    // In a real app, you'd weight this based on user profile
    if (aptitudeQuestions.length > 0) selectedQuestions.push(aptitudeQuestions[0]);
    if (aptitudeQuestions.length > 1) selectedQuestions.push(aptitudeQuestions[1]);
    if (reasoningQuestions.length > 0) selectedQuestions.push(reasoningQuestions[0]);
    if (reasoningQuestions.length > 1) selectedQuestions.push(reasoningQuestions[1]);
    if (personalityQuestions.length > 0) selectedQuestions.push(personalityQuestions[0]);
    if (personalityQuestions.length > 1) selectedQuestions.push(personalityQuestions[1]);
    if (interestQuestions.length > 0) selectedQuestions.push(interestQuestions[0]);
    if (interestQuestions.length > 1) selectedQuestions.push(interestQuestions[1]);
    if (situationalQuestions.length > 0) selectedQuestions.push(situationalQuestions[0]);
    if (situationalQuestions.length > 1) selectedQuestions.push(situationalQuestions[1]);
    
    return selectedQuestions;
  };
  
  // Submit quiz and get AI-generated feedback
  const submitQuiz = async (answers: number[]): Promise<QuizResult> => {
    if (!user || !currentQuizSession) {
      throw new Error('No active quiz session');
    }
    
    // Calculate score (for questions with correct answers)
    let correctAnswers = 0;
    let totalWithCorrectAnswers = 0;
    
    currentQuizSession.questions.forEach((question, index) => {
      // For personality/interest questions, there's no "correct" answer
      // Only count aptitude, reasoning, and situational questions
      if (['1', '2', '5'].includes(question.categoryId)) {
        totalWithCorrectAnswers++;
        if (answers[index] === question.correctOption) {
          correctAnswers++;
        }
      }
    });
    
    const score = totalWithCorrectAnswers > 0 
      ? Math.round((correctAnswers / totalWithCorrectAnswers) * 100) 
      : 0;
    
    // Generate AI feedback (simulated)
    const feedback = generateAIFeedback(
      currentQuizSession.questions, 
      answers, 
      quizInfo || undefined
    );
    
    // Mark quiz as completed
    setCurrentQuizSession({
      ...currentQuizSession,
      completed: true,
      answers,
    });
    
    // Create quiz result
    const result: QuizResult = {
      id: (Math.random() * 10000).toFixed(0),
      userId: user.id,
      quizSessionId: currentQuizSession.id,
      score,
      totalQuestions: currentQuizSession.questions.length,
      completedAt: new Date(),
      feedback,
    };
    
    setQuizResults([...quizResults, result]);
    
    // Update user's quiz history if user is a student
    if (user.role === 'student') {
      // Find the student in our mock data
      const studentIndex = students.findIndex(s => s.id === user.id);
      if (studentIndex >= 0) {
        const updatedStudents = [...students];
        updatedStudents[studentIndex] = {
          ...updatedStudents[studentIndex],
          quizHistory: [...(updatedStudents[studentIndex].quizHistory || []), result]
        };
        setStudents(updatedStudents);
      }
      
      // Also update the user profile
      const updatedUser = {
        ...user,
        // Type cast to Student to access quizHistory
        quizHistory: [...((user as Student).quizHistory || []), result]
      } as Student;
      updateUserProfile(updatedUser);
    }
    
    toast({
      title: "Quiz completed",
      description: "Your results are ready. Check out your personalized feedback!"
    });
    
    return result;
  };
  
  // Simulate AI feedback generation
  const generateAIFeedback = (
    questions: Question[], 
    answers: number[],
    userInfo?: QuizInfo
  ) => {
    // In a real app, you'd call a real AI API here
    // For demo purposes, we'll generate some basic feedback
    
    // Analyze aptitude scores
    const aptitudeCorrect = questions
      .filter(q => q.categoryId === '1')
      .reduce((count, q, i) => {
        const questionIndex = questions.indexOf(q);
        return answers[questionIndex] === q.correctOption ? count + 1 : count;
      }, 0);
    
    // Analyze reasoning scores
    const reasoningCorrect = questions
      .filter(q => q.categoryId === '2')
      .reduce((count, q, i) => {
        const questionIndex = questions.indexOf(q);
        return answers[questionIndex] === q.correctOption ? count + 1 : count;
      }, 0);
    
    // Analyze personality responses
    const personalityResponses = questions
      .filter(q => q.categoryId === '3')
      .map((q, i) => {
        const questionIndex = questions.indexOf(q);
        return answers[questionIndex];
      });
    
    // Analyze interest responses
    const interestResponses = questions
      .filter(q => q.categoryId === '4')
      .map((q, i) => {
        const questionIndex = questions.indexOf(q);
        return answers[questionIndex];
      });
    
    // Generate feedback
    const strengths = [];
    const weakAreas = [];
    
    // Aptitude feedback
    if (aptitudeCorrect >= questions.filter(q => q.categoryId === '1').length / 2) {
      strengths.push('Numerical reasoning');
      strengths.push('Quantitative problem-solving');
    } else {
      weakAreas.push('Numerical computation');
      weakAreas.push('Mathematical concepts');
    }
    
    // Reasoning feedback
    if (reasoningCorrect >= questions.filter(q => q.categoryId === '2').length / 2) {
      strengths.push('Logical thinking');
      strengths.push('Pattern recognition');
    } else {
      weakAreas.push('Critical analysis');
      weakAreas.push('Sequential reasoning');
    }
    
    // Add user's self-reported strengths and weak areas
    if (userInfo) {
      userInfo.strengths.forEach(s => {
        if (!strengths.includes(s)) strengths.push(s);
      });
      
      userInfo.weakSubjects.forEach(w => {
        if (!weakAreas.includes(w)) weakAreas.push(w);
      });
    }
    
    // Generate personality summary
    let personalitySummary = "Based on your responses, you appear to be ";
    
    if (personalityResponses.includes(0)) {
      personalitySummary += "outgoing and socially confident. ";
    } else if (personalityResponses.includes(2) || personalityResponses.includes(3)) {
      personalitySummary += "thoughtful and observant. ";
    } else {
      personalitySummary += "balanced between social engagement and reflection. ";
    }
    
    if (personalityResponses.includes(0) || personalityResponses.includes(3)) {
      personalitySummary += "You tend to trust your intuition when solving problems. ";
    } else {
      personalitySummary += "You approach problems in a methodical, analytical way. ";
    }
    
    // Generate career suggestions
    const careerSuggestions = [];
    
    // Based on aptitude and reasoning
    if (aptitudeCorrect > 0 && reasoningCorrect > 0) {
      careerSuggestions.push('Data Science');
      careerSuggestions.push('Financial Analysis');
    }
    
    // Based on personality
    if (personalityResponses.includes(0)) {
      careerSuggestions.push('Sales and Marketing');
      careerSuggestions.push('Public Relations');
    } else if (personalityResponses.includes(1) || personalityResponses.includes(3)) {
      careerSuggestions.push('Research');
      careerSuggestions.push('Content Creation');
    }
    
    // Based on interests
    if (interestResponses.includes(0)) {
      careerSuggestions.push('Academic Research');
      careerSuggestions.push('Laboratory Science');
    } else if (interestResponses.includes(1)) {
      careerSuggestions.push('Graphic Design');
      careerSuggestions.push('Creative Direction');
    } else if (interestResponses.includes(2)) {
      careerSuggestions.push('Project Management');
      careerSuggestions.push('Human Resources');
    } else if (interestResponses.includes(3)) {
      careerSuggestions.push('Software Development');
      careerSuggestions.push('IT Consulting');
    }
    
    // Add based on user info if available
    if (userInfo) {
      if (userInfo.interests.includes('Technology')) {
        careerSuggestions.push('Software Engineering');
      }
      if (userInfo.interests.includes('Science')) {
        careerSuggestions.push('Scientific Research');
      }
    }
    
    // Remove duplicates and limit to 5 suggestions
    const uniqueSuggestions = [...new Set(careerSuggestions)].slice(0, 5);
    
    return {
      strengths,
      weakAreas,
      personalitySummary,
      careerSuggestions: uniqueSuggestions,
    };
  };
  
  // Payment processing
  const processPayment = async (): Promise<Payment> => {
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // In a real app, you'd integrate with a payment provider here
    // For demo purposes, we'll simulate a successful payment
    
    const newPayment: Payment = {
      id: (payments.length + 1).toString(),
      userId: user.id,
      amount: 9.99,
      status: 'completed',
      createdAt: new Date(),
    };
    
    setPayments([...payments, newPayment]);
    
    // Update user's payment history if user is a student
    if (user.role === 'student') {
      // Find the student in our mock data
      const studentIndex = students.findIndex(s => s.id === user.id);
      if (studentIndex >= 0) {
        const updatedStudents = [...students];
        updatedStudents[studentIndex] = {
          ...updatedStudents[studentIndex],
          paymentHistory: [...(updatedStudents[studentIndex].paymentHistory || []), newPayment]
        };
        setStudents(updatedStudents);
      }
      
      // Also update the user profile
      const updatedUser = {
        ...user,
        // Type cast to Student to access paymentHistory
        paymentHistory: [...((user as Student).paymentHistory || []), newPayment]
      } as Student;
      updateUserProfile(updatedUser);
    }
    
    toast({
      title: "Payment successful",
      description: "You can now start your quiz!"
    });
    
    return newPayment;
  };
  
  // Handle page visibility changes for quiz security
  React.useEffect(() => {
    const handleVisibilityChange = () => {
      if (currentQuizSession && !currentQuizSession.completed && document.hidden) {
        toast({
          title: "Warning",
          description: "Leaving the quiz page will reset your progress!",
          variant: "destructive",
        });
        // In a real app, you might want to automatically end the quiz
        // or implement a more sophisticated security mechanism
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [currentQuizSession]);
  
  const value = {
    categories,
    questions,
    quizInfo,
    currentQuizSession,
    quizResults,
    payments,
    students,
    setQuizInfo,
    addCategory,
    updateCategory,
    deleteCategory,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    startQuiz,
    submitQuiz,
    processPayment,
    getQuizSessionSecurityStatus,
    getStudentById,
  };
  
  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};
