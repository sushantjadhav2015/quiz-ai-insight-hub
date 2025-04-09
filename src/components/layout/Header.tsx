
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Brain, Menu, User, LogOut, Settings, History, Award } from 'lucide-react';

const Header: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center space-x-2">
            <Brain className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-primary">Quiz Insight</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link
            to="/"
            className={`transition-colors hover:text-primary ${
              location.pathname === '/' ? 'text-primary font-medium' : 'text-muted-foreground'
            }`}
          >
            Home
          </Link>
          {user ? (
            <>
              {isAdmin ? (
                <>
                  <Link
                    to="/admin/categories"
                    className={`transition-colors hover:text-primary ${
                      location.pathname.startsWith('/admin/categories') ? 'text-primary font-medium' : 'text-muted-foreground'
                    }`}
                  >
                    Categories
                  </Link>
                  <Link
                    to="/admin/questions"
                    className={`transition-colors hover:text-primary ${
                      location.pathname.startsWith('/admin/questions') ? 'text-primary font-medium' : 'text-muted-foreground'
                    }`}
                  >
                    Questions
                  </Link>
                  <Link
                    to="/admin/students"
                    className={`transition-colors hover:text-primary ${
                      location.pathname.startsWith('/admin/students') ? 'text-primary font-medium' : 'text-muted-foreground'
                    }`}
                  >
                    Students
                  </Link>
                  <Link
                    to="/admin/payments"
                    className={`transition-colors hover:text-primary ${
                      location.pathname.startsWith('/admin/payments') ? 'text-primary font-medium' : 'text-muted-foreground'
                    }`}
                  >
                    Payments
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/dashboard"
                    className={`transition-colors hover:text-primary ${
                      location.pathname === '/dashboard' ? 'text-primary font-medium' : 'text-muted-foreground'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/quiz"
                    className={`transition-colors hover:text-primary ${
                      location.pathname.startsWith('/quiz') ? 'text-primary font-medium' : 'text-muted-foreground'
                    }`}
                  >
                    Take a Quiz
                  </Link>
                  <Link
                    to="/results"
                    className={`transition-colors hover:text-primary ${
                      location.pathname.startsWith('/results') ? 'text-primary font-medium' : 'text-muted-foreground'
                    }`}
                  >
                    My Results
                  </Link>
                </>
              )}
            </>
          ) : (
            <>
              <Link
                to="/features"
                className={`transition-colors hover:text-primary ${
                  location.pathname === '/features' ? 'text-primary font-medium' : 'text-muted-foreground'
                }`}
              >
                Features
              </Link>
              <Link
                to="/about"
                className={`transition-colors hover:text-primary ${
                  location.pathname === '/about' ? 'text-primary font-medium' : 'text-muted-foreground'
                }`}
              >
                About
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isAdmin ? (
                  <>
                    <DropdownMenuItem onClick={() => navigate('/admin/dashboard')}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Admin Dashboard</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/admin/categories')}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Manage Categories</span>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/results')}>
                      <History className="mr-2 h-4 w-4" />
                      <span>Quiz History</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Profile Settings</span>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="outline" size="sm" onClick={() => navigate('/login')}>
                Log In
              </Button>
              <Button size="sm" onClick={() => navigate('/register')}>
                Register
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => navigate('/menu')}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
