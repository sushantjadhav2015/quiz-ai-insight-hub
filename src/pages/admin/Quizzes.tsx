
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/AuthContext';
import { useQuiz } from '@/QuizContext';
import { useQuizzes } from '@/hooks/useQuizzes';
import Layout from '@/components/layout/Layout';
import QuizForm from '@/components/quizzes/QuizForm';
import QuizCard from '@/components/quizzes/QuizCard';
import QuizTable from '@/components/quizzes/QuizTable';
import { ViewMode } from '@/components/questions/ViewToggle';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, ArrowRight, Book, BookPlus } from 'lucide-react';
import { Quiz } from '@/types';

const QuizzesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading, isAdmin } = useAuth();
  const { categories } = useQuiz();
  const { quizzes, isLoading: quizzesLoading, addQuiz, editQuiz, removeQuiz } = useQuizzes();
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      navigate('/login');
    }
  }, [user, isLoading, isAdmin, navigate]);

  const filteredQuizzes = quizzes.filter(quiz =>
    quiz.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    quiz.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (quiz: Quiz) => {
    setCurrentQuiz(quiz);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    // Confirm before deletion
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      removeQuiz(id);
    }
  };

  const handleSubmit = (formData: any) => {
    if (currentQuiz) {
      // Update existing quiz
      editQuiz({
        ...currentQuiz,
        ...formData
      });
    } else {
      // Create new quiz
      addQuiz(formData);
    }
    setIsModalOpen(false);
    setCurrentQuiz(undefined);
  };

  if (isLoading || !user || !isAdmin) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  return (
    <Layout>
      <div className="container py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Quiz Management</h1>
            <p className="text-muted-foreground">
              Create and manage quizzes for your students
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-4">
            <Button onClick={() => navigate('/admin/dashboard')}>
              Back to Dashboard
            </Button>
            <Button onClick={() => {
              setCurrentQuiz(undefined);
              setIsModalOpen(true);
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Create Quiz
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="flex items-center">
              <Book className="h-5 w-5 mr-2 text-primary" />
              <h2 className="text-2xl font-semibold">Quiz Collection</h2>
            </div>

            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                Grid
              </Button>
              <Button
                variant={viewMode === 'table' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('table')}
              >
                Table
              </Button>
            </div>
          </div>

          {quizzesLoading ? (
            <div className="text-center py-10">Loading quizzes...</div>
          ) : (
            <>
              {/* Search bar */}
              <div className="relative w-full md:max-w-sm">
                <input
                  type="text"
                  placeholder="Search quizzes..."
                  className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Quizzes display based on view mode */}
              {viewMode === 'table' ? (
                <QuizTable 
                  quizzes={filteredQuizzes} 
                  categories={categories}
                  onEdit={handleEdit} 
                  onDelete={handleDelete}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredQuizzes.length > 0 ? (
                    filteredQuizzes.map(quiz => (
                      <QuizCard 
                        key={quiz.id} 
                        quiz={quiz} 
                        categories={categories}
                        onEdit={handleEdit} 
                        onDelete={handleDelete} 
                      />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-10 border rounded-md">
                      <BookPlus className="w-12 h-12 mx-auto text-muted-foreground" />
                      <h3 className="mt-4 text-lg font-medium">No quizzes found</h3>
                      <p className="text-muted-foreground">
                        {searchQuery ? 
                          'Try adjusting your search query' : 
                          'Get started by creating your first quiz'}
                      </p>
                      {!searchQuery && (
                        <Button 
                          className="mt-4" 
                          onClick={() => {
                            setCurrentQuiz(undefined);
                            setIsModalOpen(true);
                          }}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Create Quiz
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{currentQuiz ? 'Edit Quiz' : 'Create Quiz'}</DialogTitle>
            </DialogHeader>
            <QuizForm
              categories={categories}
              initialData={currentQuiz}
              onSubmit={handleSubmit}
              onCancel={() => {
                setIsModalOpen(false);
                setCurrentQuiz(undefined);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default QuizzesPage;
