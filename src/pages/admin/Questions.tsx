
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/AuthContext';
import { useQuiz } from '@/QuizContext';
import Layout from '@/components/layout/Layout';
import QuestionForm from '@/components/questions/QuestionForm';
import QuestionFilters from '@/components/questions/QuestionFilters';
import QuestionCard from '@/components/questions/QuestionCard';
import QuestionTable from '@/components/questions/QuestionTable';
import QuestionPagination from '@/components/questions/QuestionPagination';
import { ViewMode } from '@/components/questions/ViewToggle';
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from '@/hooks/use-toast';
import { useQuestionManagement } from '@/hooks/useQuestionManagement';

const ITEMS_PER_PAGE = 5;

const QuestionsPage = () => {
  const navigate = useNavigate();
  const { user, isLoading, isAdmin } = useAuth();
  const { categories, questions, addQuestion, updateQuestion, deleteQuestion } = useQuiz();
  const { filters, form } = useQuestionManagement();
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  
  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      navigate('/login');
    }
  }, [user, isLoading, isAdmin, navigate]);
  
  if (isLoading || !user || !isAdmin) {
    return <div className="p-10 text-center">Loading...</div>;
  }
  
  const filteredQuestions = questions.filter(question => {
    const matchesCategory = filters.selectedCategory === 'all' || question.categoryId === filters.selectedCategory;
    const matchesSearch = !filters.searchQuery || 
      question.text.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      question.options.some(option => option.toLowerCase().includes(filters.searchQuery.toLowerCase()));
    const matchesDifficulty = filters.selectedDifficulty === 'all' || question.difficulty === filters.selectedDifficulty;
    
    return matchesCategory && matchesSearch && matchesDifficulty;
  });
  
  const totalPages = Math.ceil(filteredQuestions.length / ITEMS_PER_PAGE);
  const startIndex = (filters.currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedQuestions = filteredQuestions.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.newQuestion.categoryId) {
      form.handleQuestionChange('categoryId', filters.selectedCategory !== 'all' ? filters.selectedCategory : '');
    }
    
    if (form.isEditing && form.editingQuestionId) {
      updateQuestion({
        ...form.newQuestion,
        id: form.editingQuestionId,
      });
    } else {
      addQuestion(form.newQuestion);
    }
    
    form.resetForm();
    form.setIsModalOpen(false);
  };
  
  const handleDeleteQuestion = (id: string) => {
    deleteQuestion(id);
    toast({
      title: "Question deleted",
      description: "The question has been deleted successfully."
    });
  };
  
  const handleClearFilters = () => {
    filters.setSelectedCategory('all');
    filters.setSearchQuery('');
    filters.setSelectedDifficulty('all');
    filters.setCurrentPage(1);
  };
  
  return (
    <Layout>
      <div className="container py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Question Management</h1>
            <p className="text-muted-foreground">
              Add, edit, and manage questions for your quizzes
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-4">
            <Button onClick={() => navigate('/admin/dashboard')}>
              Back to Dashboard
            </Button>
            <Button onClick={() => {
              form.resetForm();
              form.setIsModalOpen(true);
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Add New Question
            </Button>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h2 className="text-2xl font-semibold">Question Bank</h2>
              <p className="text-sm text-muted-foreground">
                Browse and manage your questions
              </p>
            </div>
          </div>
          
          <QuestionFilters
            selectedCategory={filters.selectedCategory}
            setSelectedCategory={filters.setSelectedCategory}
            searchQuery={filters.searchQuery}
            setSearchQuery={filters.setSearchQuery}
            selectedDifficulty={filters.selectedDifficulty}
            setSelectedDifficulty={filters.setSelectedDifficulty}
            setCurrentPage={filters.setCurrentPage}
            categories={categories}
            handleClearFilters={handleClearFilters}
            filteredQuestionsCount={filteredQuestions.length}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />
          
          <div className="space-y-4">
            {filteredQuestions.length > 0 ? (
              <>
                {viewMode === 'table' ? (
                  <QuestionTable
                    questions={paginatedQuestions}
                    categories={categories}
                    onEdit={form.handleEditQuestion}
                    onDelete={handleDeleteQuestion}
                  />
                ) : (
                  <div className="space-y-4">
                    {paginatedQuestions.map((question) => (
                      <QuestionCard
                        key={question.id}
                        question={question}
                        category={categories.find(c => c.id === question.categoryId)}
                        onEdit={form.handleEditQuestion}
                        onDelete={handleDeleteQuestion}
                      />
                    ))}
                  </div>
                )}
                
                {totalPages > 1 && (
                  <QuestionPagination
                    currentPage={filters.currentPage}
                    totalPages={totalPages}
                    setCurrentPage={filters.setCurrentPage}
                  />
                )}
              </>
            ) : (
              <div className="text-center py-10 text-muted-foreground border rounded-md p-8">
                {filters.searchQuery || filters.selectedCategory !== 'all' || filters.selectedDifficulty !== 'all' ? 
                  'No questions found matching your filters.' : 
                  'No questions available yet.'}
              </div>
            )}
          </div>
        </div>
        
        <Dialog open={form.isModalOpen} onOpenChange={form.setIsModalOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{form.isEditing ? 'Edit Question' : 'Add New Question'}</DialogTitle>
            </DialogHeader>
            <QuestionForm
              categories={categories}
              newQuestion={form.newQuestion}
              isEditing={form.isEditing}
              onQuestionChange={form.handleQuestionChange}
              onOptionChange={form.handleOptionChange}
              onSubmit={handleSubmit}
              onCancel={() => {
                form.resetForm();
                form.setIsModalOpen(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default QuestionsPage;
