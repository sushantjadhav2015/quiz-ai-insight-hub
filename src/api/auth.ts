
import { User, Student } from '../types';
import { delay } from './utils';
import usersData from '../data/users.json';

export const loginUser = async (email: string, password: string): Promise<User> => {
  await delay(500);
  
  const user = usersData.find(u => u.email === email);
  
  if (user && password === "password") {
    return user as User;
  }
  
  throw new Error("Invalid credentials");
};

export const registerUser = async (name: string, email: string, password: string): Promise<User> => {
  await delay(700);
  
  if (usersData.some(u => u.email === email)) {
    throw new Error("Email already registered");
  }
  
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
  await delay(600);
  
  const user = usersData.find(u => u.id === userId);
  
  if (!user) {
    throw new Error("User not found");
  }
  
  return { ...user, ...userData } as User;
};
