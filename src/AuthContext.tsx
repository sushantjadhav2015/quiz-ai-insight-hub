
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Student } from "./types";
import { toast } from "./components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginUser, registerUser, updateUserProfile } from "./api";

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
  const [isAdmin, setIsAdmin] = useState(false);
  const [isStudent, setIsStudent] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Check if user is already logged in (from localStorage in this demo)
  useEffect(() => {
    const storedUser = localStorage.getItem("quizUser");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAdmin(parsedUser.role === "admin");
      setIsStudent(parsedUser.role === "student");
    }
    setIsLoading(false);
  }, []);

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => 
      loginUser(email, password),
    onSuccess: (user) => {
      setUser(user);
      setIsAdmin(user.role === "admin");
      setIsStudent(user.role === "student");
      localStorage.setItem("quizUser", JSON.stringify(user));
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.name}!`,
      });
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: ({ name, email, password }: { name: string; email: string; password: string }) => 
      registerUser(name, email, password),
    onSuccess: (user) => {
      setUser(user);
      setIsAdmin(user.role === "admin");
      setIsStudent(user.role === "student");
      localStorage.setItem("quizUser", JSON.stringify(user));
      toast({
        title: "Registration successful",
        description: `Welcome, ${user.name}!`,
      });
    },
  });

  // Update user profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: ({ userId, userData }: { userId: string; userData: Partial<Student> }) => 
      updateUserProfile(userId, userData),
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      localStorage.setItem("quizUser", JSON.stringify(updatedUser));
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      // Invalidate any queries that might depend on user data
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  const login = async (email: string, password: string) => {
    await loginMutation.mutateAsync({ email, password });
  };

  const register = async (name: string, email: string, password: string) => {
    await registerMutation.mutateAsync({ name, email, password });
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
    setIsStudent(false);
    localStorage.removeItem("quizUser");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/");
    // Clear any user-related queries from the cache
    queryClient.invalidateQueries();
  };

  const updateProfile = async (userData: Partial<Student>) => {
    if (!user) return;
    await updateProfileMutation.mutateAsync({ 
      userId: user.id, 
      userData 
    });
  };

  const value = {
    user,
    isLoading: isLoading || loginMutation.isPending || registerMutation.isPending,
    isAdmin,
    isStudent,
    login,
    register,
    logout,
    updateUserProfile: updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
