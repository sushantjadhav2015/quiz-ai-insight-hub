
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Brain, History, Book, List } from 'lucide-react';

const Header: React.FC = () => {
  const { user, isLoading, logout, isAdmin, isStudent } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  return (
    <header className="border-b py-4">
      <div className="container flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <Brain className="h-8 w-8 text-primary mr-2" />
            <span className="font-bold text-xl">Quiz Insight</span>
          </Link>
          
          {user && (
            <nav className="hidden md:flex ml-8 space-x-4">
              {isStudent && (
                <>
                  <Button
                    variant={isActive('/dashboard') ? 'default' : 'ghost'}
                    onClick={() => navigate('/dashboard')}
                  >
                    Dashboard
                  </Button>
                  <Button
                    variant={isActive('/quiz/list') ? 'default' : 'ghost'}
                    onClick={() => navigate('/quiz/list')}
                  >
                    <List className="h-4 w-4 mr-2" />
                    Quiz List
                  </Button>
                  <Button
                    variant={isActive('/history') ? 'default' : 'ghost'}
                    onClick={() => navigate('/history')}
                  >
                    <History className="h-4 w-4 mr-2" />
                    History
                  </Button>
                  <Button
                    variant={isActive('/quiz/info') ? 'default' : 'ghost'}
                    onClick={() => navigate('/quiz/info')}
                  >
                    Take Quiz
                  </Button>
                </>
              )}
              
              {isAdmin && (
                <>
                  <Button
                    variant={isActive('/admin/dashboard') ? 'default' : 'ghost'}
                    onClick={() => navigate('/admin/dashboard')}
                  >
                    Dashboard
                  </Button>
                  <Button
                    variant={isActive('/admin/categories') ? 'default' : 'ghost'}
                    onClick={() => navigate('/admin/categories')}
                  >
                    Categories
                  </Button>
                  <Button
                    variant={isActive('/admin/questions') ? 'default' : 'ghost'}
                    onClick={() => navigate('/admin/questions')}
                  >
                    Questions
                  </Button>
                  <Button
                    variant={isActive('/admin/quizzes') ? 'default' : 'ghost'}
                    onClick={() => navigate('/admin/quizzes')}
                  >
                    <Book className="h-4 w-4 mr-2" />
                    Quizzes
                  </Button>
                  <Button
                    variant={isActive('/admin/students') ? 'default' : 'ghost'}
                    onClick={() => navigate('/admin/students')}
                  >
                    Students
                  </Button>
                </>
              )}
            </nav>
          )}
        </div>
        
        <div>
          {isLoading ? (
            <Button variant="ghost" disabled>
              Loading...
            </Button>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar>
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
                <DropdownMenuLabel className="text-sm font-normal text-muted-foreground">
                  {user.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate(isAdmin ? '/admin/dashboard' : '/dashboard')}>
                  Dashboard
                </DropdownMenuItem>
                {isStudent && (
                  <>
                    <DropdownMenuItem onClick={() => navigate('/quiz/list')}>
                      Quiz List
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/history')}>
                      History
                    </DropdownMenuItem>
                  </>
                )}
                {isAdmin && (
                  <DropdownMenuItem onClick={() => navigate('/admin/quizzes')}>
                    Quizzes
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex space-x-2">
              <Button variant="ghost" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button onClick={() => navigate('/register')}>
                Register
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
