
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Admin, Student } from './types';
import { toast } from './components/ui/use-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  isStudent: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserProfile: (userData: Partial<Student>) => Promise<void>;
}

// Mock users for demo purposes
const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
  } as Admin,
  {
    id: '2',
    email: 'student@example.com',
    name: 'Student User',
    role: 'student',
    age: 18,
    interests: ['Technology', 'Science'],
    strengths: ['Problem Solving', 'Creativity'],
    weakSubjects: ['History', 'Literature'],
    quizHistory: [],
    paymentHistory: [],
  } as Student,
];

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAdmin: false,
  isStudent: false,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  updateUserProfile: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in (from localStorage in this demo)
  useEffect(() => {
    const storedUser = localStorage.getItem('quizUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // In a real app, you would validate with an API
    // For demo, we'll just check against our mock users
    const foundUser = MOCK_USERS.find(u => u.email === email);
    
    if (foundUser && password === 'password') { // Simple password check for demo
      setUser(foundUser);
      localStorage.setItem('quizUser', JSON.stringify(foundUser));
      toast({
        title: "Login successful",
        description: `Welcome back, ${foundUser.name}!`,
      });
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const register = async (name: string, email: string, password: string) => {
    // Check if email already exists
    if (MOCK_USERS.some(u => u.email === email)) {
      throw new Error('Email already registered');
    }

    // Create a new student user
    const newUser: Student = {
      id: (MOCK_USERS.length + 1).toString(),
      email,
      name,
      role: 'student',
      quizHistory: [],
      paymentHistory: [],
    };

    // In a real app, you would send this to your API
    // For demo, we'll just add to our mock users and set as current
    MOCK_USERS.push(newUser);
    setUser(newUser);
    localStorage.setItem('quizUser', JSON.stringify(newUser));
    
    toast({
      title: "Registration successful",
      description: `Welcome, ${name}!`,
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('quizUser');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const updateUserProfile = async (userData: Partial<Student>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem('quizUser', JSON.stringify(updatedUser));
    
    // In a real app, you would update this in your backend API
    const userIndex = MOCK_USERS.findIndex(u => u.id === user.id);
    if (userIndex >= 0) {
      MOCK_USERS[userIndex] = updatedUser;
    }
    
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    });
  };

  const value = {
    user,
    isLoading,
    isAdmin: user?.role === 'admin',
    isStudent: user?.role === 'student',
    login,
    register,
    logout,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
