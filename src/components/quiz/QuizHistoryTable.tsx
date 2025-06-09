
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { QuizResult, Payment } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { 
  MoreHorizontal, 
  FileText, 
  CreditCard, 
  Play,
  Search
} from 'lucide-react';

interface QuizHistoryItem {
  id: string;
  type: 'payment' | 'quiz';
  date: Date;
  quizName: string;
  sessionId: string;
  amount?: number;
  score?: number;
  totalQuestions?: number;
  status: 'completed' | 'pending' | 'available' | 'failed';
  paymentId?: string;
  quizResultId?: string;
  quizSessionId?: string;
}

interface QuizHistoryTableProps {
  quizResults: QuizResult[];
  payments: Payment[];
  onStartQuiz: (paymentId: string) => void;
  onViewResult: (resultId: string) => void;
  onViewPayment: (paymentId: string) => void;
}

const QuizHistoryTable: React.FC<QuizHistoryTableProps> = ({
  quizResults,
  payments,
  onStartQuiz,
  onViewResult,
  onViewPayment
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Generate quiz names based on session ID
  const getQuizName = (sessionId: string) => {
    const names = [
      'Standard 8', 'Class 7', 'Advanced Math', 'Science Quiz', 'English Test',
      'History Assessment', 'Geography Challenge', 'Physics Exam', 'Chemistry Test', 'Biology Quiz'
    ];
    const index = parseInt(sessionId) % names.length;
    return names[index] || 'Quiz Session';
  };

  // Combine and transform payment and quiz data
  const historyItems = useMemo(() => {
    const items: QuizHistoryItem[] = [];

    // Add payments
    payments.forEach(payment => {
      const relatedQuizResult = quizResults.find(result => result.quizSessionId === payment.quizSessionId);
      const sessionId = payment.quizSessionId || `temp-${payment.id}`;
      
      items.push({
        id: `payment-${payment.id}`,
        type: 'payment',
        date: payment.createdAt,
        quizName: getQuizName(sessionId),
        sessionId: sessionId,
        amount: payment.amount,
        status: payment.quizSessionId ? 'completed' : 
                payment.status === 'completed' ? 'available' : 
                payment.status as 'pending' | 'failed',
        paymentId: payment.id,
        quizResultId: relatedQuizResult?.id,
        quizSessionId: payment.quizSessionId
      });
    });

    // Add quiz results that don't have corresponding payments
    quizResults.forEach(result => {
      const hasPayment = payments.some(p => p.quizSessionId === result.quizSessionId);
      if (!hasPayment) {
        items.push({
          id: `quiz-${result.id}`,
          type: 'quiz',
          date: result.completedAt,
          quizName: getQuizName(result.quizSessionId),
          sessionId: result.quizSessionId,
          score: result.score,
          totalQuestions: result.totalQuestions,
          status: 'completed',
          quizResultId: result.id,
          quizSessionId: result.quizSessionId
        });
      }
    });

    return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [payments, quizResults]);

  // Filter items based on search term
  const filteredItems = useMemo(() => {
    if (!searchTerm) return historyItems;
    
    return historyItems.filter(item =>
      item.quizName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sessionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.amount && item.amount.toString().includes(searchTerm))
    );
  }, [historyItems, searchTerm]);

  // Paginate items
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredItems, currentPage]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const handleStartQuiz = (paymentId: string) => {
    onStartQuiz(paymentId);
  };

  const handleViewResult = (resultId: string) => {
    navigate(`/results/${resultId}`);
  };

  const getStatusBadge = (status: string, score?: number) => {
    switch (status) {
      case 'completed':
        return (
          <Badge className="bg-green-500">
            {score ? `Completed (${score}%)` : 'Completed'}
          </Badge>
        );
      case 'available':
        return <Badge className="bg-blue-500">Available</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-500">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const renderActions = (item: QuizHistoryItem) => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-white border shadow-md">
          {/* If quiz is completed, show result option */}
          {item.quizResultId && (
            <DropdownMenuItem onClick={() => handleViewResult(item.quizResultId!)}>
              <FileText className="mr-2 h-4 w-4" />
              View Result
            </DropdownMenuItem>
          )}
          
          {/* If payment is available but quiz not started, show start option */}
          {item.status === 'available' && item.paymentId && (
            <DropdownMenuItem onClick={() => handleStartQuiz(item.paymentId!)}>
              <Play className="mr-2 h-4 w-4" />
              Start Quiz
            </DropdownMenuItem>
          )}
          
          {/* Always show payment history if there's a payment */}
          {item.paymentId && (
            <DropdownMenuItem onClick={() => onViewPayment(item.paymentId!)}>
              <CreditCard className="mr-2 h-4 w-4" />
              Payment Details
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search quiz history..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Quiz</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedItems.length > 0 ? (
              paginatedItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{new Date(item.date).toLocaleDateString()}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(item.date), { addSuffix: true })}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{item.quizName}</div>
                    <div className="text-xs text-muted-foreground">
                      ID: {item.sessionId.substring(0, 8)}...
                    </div>
                  </TableCell>
                  <TableCell>
                    {item.amount ? `₹${item.amount.toFixed(2)}` : '-'}
                  </TableCell>
                  <TableCell>
                    {item.score ? (
                      <span className="font-medium">{item.score}%</span>
                    ) : (
                      '-'
                    )}
                    {item.totalQuestions && (
                      <div className="text-xs text-muted-foreground">
                        /{item.totalQuestions} questions
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(item.status, item.score)}
                  </TableCell>
                  <TableCell className="text-right">
                    {renderActions(item)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  {searchTerm ? 'No results found.' : 'No quiz history available.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => setCurrentPage(page)}
                  isActive={currentPage === page}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default QuizHistoryTable;
