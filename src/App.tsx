
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import { QuizProvider } from "./QuizContext";

// Public Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

// Student Pages
import Dashboard from "./pages/Dashboard";
import StudentHistory from "./pages/StudentHistory";
import QuizInfo from "./pages/quiz/QuizInfo";
import QuizPayment from "./pages/quiz/QuizPayment";
import QuizSession from "./pages/quiz/QuizSession";
import QuizResult from "./pages/quiz/QuizResult";
import QuizCategorySelection from "./pages/quiz/QuizCategorySelection";
import QuizList from "./pages/quiz/QuizList";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import Categories from "./pages/admin/Categories";
import Students from "./pages/admin/Students";
import Payments from "./pages/admin/Payments";
import Questions from "./pages/admin/Questions";
import Quizzes from "./pages/admin/Quizzes";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <QuizProvider>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Student Routes */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/history" element={<StudentHistory />} />
                <Route path="/quiz/info" element={<QuizInfo />} />
                <Route path="/quiz/list" element={<QuizList />} />
                <Route path="/quiz/categories" element={<QuizCategorySelection />} />
                <Route path="/quiz/payment" element={<QuizPayment />} />
                <Route path="/quiz/session" element={<QuizSession />} />
                <Route path="/results/:resultId" element={<QuizResult />} />
                
                {/* Admin Routes */}
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/categories" element={<Categories />} />
                <Route path="/admin/students" element={<Students />} />
                <Route path="/admin/payments" element={<Payments />} />
                <Route path="/admin/questions" element={<Questions />} />
                <Route path="/admin/quizzes" element={<Quizzes />} />
                
                {/* 404 Catch-All Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </QuizProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
