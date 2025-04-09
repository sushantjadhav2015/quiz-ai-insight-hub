
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
import QuizInfo from "./pages/quiz/QuizInfo";
import QuizPayment from "./pages/quiz/QuizPayment";
import QuizSession from "./pages/quiz/QuizSession";
import QuizResult from "./pages/quiz/QuizResult";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import Categories from "./pages/admin/Categories";

const queryClient = new QueryClient();

const App = () => (
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
              <Route path="/quiz/info" element={<QuizInfo />} />
              <Route path="/quiz/payment" element={<QuizPayment />} />
              <Route path="/quiz/session" element={<QuizSession />} />
              <Route path="/results/:resultId" element={<QuizResult />} />
              
              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/categories" element={<Categories />} />
              
              {/* 404 Catch-All Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </QuizProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
