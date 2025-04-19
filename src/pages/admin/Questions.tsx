
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/AuthContext';
import { useQuiz } from '@/QuizContext';
import Layout from '@/components/layout/Layout';
import QuestionForm from '@/components/questions/QuestionForm';
import QuestionFilters from '@/components/questions/QuestionFilters';
import QuestionCard from '@/components/questions/QuestionCard';
import QuestionPagination from '@/components/questions/QuestionPagination';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from '@/hooks/use-toast';

const ITEMS_PER_PAGE = 5;

const QuestionsPage = () => {
  const navigate = useNavigate();
  const { user, isLoading, isAdmin } = useAuth();
  const { categories, questions, addQuestion, updateQuestion, deleteQuestion } = useQuiz();
  
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  
  const [newQuestion, setNewQuestion] = useState({
    text: '',
    categoryId: '',
    options: ['', '', '', ''],
    correctOption: 0,
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    explanation: '',
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      navigate('/login');
    }
  }, [user, isLoading, isAdmin, navigate]);
  
  if (isLoading || !user || !isAdmin) {
    return <div className="p-10 text-center">Loading...</div>;
  }
  
  const filteredQuestions = questions.filter(question => {
    const matchesCategory = selectedCategory === 'all' || question.categoryId === selectedCategory;
    const matchesSearch = !searchQuery || 
      question.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.options.some(option => option.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDifficulty = selectedDifficulty === 'all' || question.difficulty === selectedDifficulty;
    
    return matchesCategory && matchesSearch && matchesDifficulty;
  });
  
  const totalPages = Math.ceil(filteredQuestions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedQuestions = filteredQuestions.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  
  const resetForm = () => {
    setNewQuestion({
      text: '',
      categoryId: selectedCategory !== 'all' ? selectedCategory : '',
      options: ['', '', '', ''],
      correctOption: 0,
      difficulty: 'medium',
      explanation: '',
    });
    setIsEditing(false);
    setEditingQuestionId(null);
  };
  
  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions[index] = value;
    setNewQuestion({ ...newQuestion, options: updatedOptions });
  };
  
  const handleQuestionChange = (field: string, value: any) => {
    setNewQuestion({ ...newQuestion, [field]: value });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newQuestion.categoryId) {
      setNewQuestion({ ...newQuestion, categoryId: selectedCategory !== 'all' ? selectedCategory : '' });
    }
    
    if (isEditing && editingQuestionId) {
      updateQuestion({
        ...newQuestion,
        id: editingQuestionId,
      });
    } else {
      addQuestion(newQuestion);
    }
    
    resetForm();
    setIsModalOpen(false);
  };
  
  const handleEditQuestion = (question: any) => {
    setNewQuestion({
      text: question.text,
      categoryId: question.categoryId,
      options: [...question.options],
      correctOption: question.correctOption,
      difficulty: question.difficulty,
      explanation: question.explanation || '',
    });
    setIsEditing(true);
    setEditingQuestionId(question.id);
    setIsModalOpen(true);
  };
  
  const handleDeleteQuestion = (id: string) => {
    deleteQuestion(id);
    toast({
      title: "Question deleted",
      description: "The question has been deleted successfully."
    });
  };
  
  const handleClearFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSelectedDifficulty('all');
    setCurrentPage(1);
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
              resetForm();
              setIsModalOpen(true);
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Add New Question
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Question Bank</CardTitle>
            <CardDescription>
              Browse and manage your questions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <QuestionFilters
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedDifficulty={selectedDifficulty}
              setSelectedDifficulty={setSelectedDifficulty}
              setCurrentPage={setCurrentPage}
              categories={categories}
              handleClearFilters={handleClearFilters}
              filteredQuestionsCount={filteredQuestions.length}
            />
            
            <div className="space-y-4 mt-6">
              {filteredQuestions.length > 0 ? (
                <>
                  {paginatedQuestions.map((question) => (
                    <QuestionCard
                      key={question.id}
                      question={question}
                      category={categories.find(c => c.id === question.categoryId)}
                      onEdit={handleEditQuestion}
                      onDelete={handleDeleteQuestion}
                    />
                  ))}
                  
                  {totalPages > 1 && (
                    <QuestionPagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      setCurrentPage={setCurrentPage}
                    />
                  )}
                </>
              ) : (
                <div className="text-center py-10 text-muted-foreground">
                  {searchQuery || selectedCategory !== 'all' || selectedDifficulty !== 'all' ? 
                    'No questions found matching your filters.' : 
                    'No questions available yet.'}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Edit Question' : 'Add New Question'}</DialogTitle>
            </DialogHeader>
            <QuestionForm
              categories={categories}
              newQuestion={newQuestion}
              isEditing={isEditing}
              onQuestionChange={handleQuestionChange}
              onOptionChange={handleOptionChange}
              onSubmit={handleSubmit}
              onCancel={() => {
                resetForm();
                setIsModalOpen(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default QuestionsPage;
