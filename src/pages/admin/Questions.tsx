
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/AuthContext';
import { useQuiz } from '@/QuizContext';
import Layout from '@/components/layout/Layout';
import QuestionForm from '@/components/questions/QuestionForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Plus,
  Search,
  Edit,
  Trash 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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
  
  const generatePaginationItems = () => {
    const items = [];
    
    items.push(
      <PaginationItem key="page-1">
        <PaginationLink 
          onClick={() => setCurrentPage(1)}
          isActive={currentPage === 1}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );
    
    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis-1">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (i <= 1 || i >= totalPages) continue;
      
      items.push(
        <PaginationItem key={`page-${i}`}>
          <PaginationLink 
            onClick={() => setCurrentPage(i)}
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    if (currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis-2">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    if (totalPages > 1) {
      items.push(
        <PaginationItem key={`page-${totalPages}`}>
          <PaginationLink 
            onClick={() => setCurrentPage(totalPages)}
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return items;
  };
  
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
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="search" className="sr-only">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search questions or answers..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                    />
                  </div>
                </div>
                
                <div className="w-full md:w-1/4">
                  <Select 
                    value={selectedCategory} 
                    onValueChange={(value) => {
                      setSelectedCategory(value);
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="w-full md:w-1/4">
                  <Select 
                    value={selectedDifficulty} 
                    onValueChange={(value) => {
                      setSelectedDifficulty(value);
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Difficulties" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Difficulties</SelectItem>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {(searchQuery || selectedCategory !== 'all' || selectedDifficulty !== 'all') && (
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    {filteredQuestions.length} results found
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                    Clear filters
                  </Button>
                </div>
              )}
            </div>
            
            <div className="space-y-4 mt-6">
              {filteredQuestions.length > 0 ? (
                <>
                  {paginatedQuestions.map((question) => {
                    const category = categories.find(c => c.id === question.categoryId);
                    return (
                      <Card key={question.id} className="border border-muted">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline">{category?.name || 'Unknown Category'}</Badge>
                                <Badge 
                                  variant="outline" 
                                  className={
                                    question.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                                    question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                  }
                                >
                                  {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
                                </Badge>
                              </div>
                              <CardTitle className="text-base font-medium">{question.text}</CardTitle>
                            </div>
                            <div className="flex space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditQuestion(question)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-700"
                                onClick={() => handleDeleteQuestion(question.id)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {question.options.map((option, index) => (
                              <div 
                                key={index}
                                className={`p-2 border rounded-md ${
                                  index === question.correctOption ? 'border-green-500 bg-green-50' : ''
                                }`}
                              >
                                {index === question.correctOption && (
                                  <Badge className="bg-green-500 mb-1">Correct</Badge>
                                )}
                                <p>{option}</p>
                              </div>
                            ))}
                          </div>
                          
                          {question.explanation && (
                            <div className="mt-4 p-3 bg-muted rounded-md">
                              <p className="text-sm font-medium">Explanation:</p>
                              <p className="text-sm text-muted-foreground">{question.explanation}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                  
                  {totalPages > 1 && (
                    <Pagination className="mt-8">
                      <PaginationContent>
                        {currentPage > 1 && (
                          <PaginationPrevious 
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} 
                          />
                        )}
                        
                        {generatePaginationItems()}
                        
                        {currentPage < totalPages && (
                          <PaginationNext 
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} 
                          />
                        )}
                      </PaginationContent>
                    </Pagination>
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
