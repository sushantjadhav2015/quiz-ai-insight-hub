
import React from 'react';
import { Category } from '@/types';
import { Quiz, CategoryPercentage } from '@/types/quiz';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pencil, Trash2 } from 'lucide-react';

interface QuizTableProps {
  quizzes: Quiz[];
  categories: Category[];
  onEdit: (quiz: Quiz) => void;
  onDelete: (id: string) => void;
}

const QuizTable: React.FC<QuizTableProps> = ({ quizzes, categories, onEdit, onDelete }) => {
  // Format category distribution to readable string
  const formatCategoryDistribution = (distribution: CategoryPercentage[]): string => {
    return distribution.map(dist => {
      const category = categories.find(c => c.id === dist.categoryId);
      return `${category?.name || 'Unknown'} (${dist.percentage}%)`;
    }).join(', ');
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead className="hidden md:table-cell">Description</TableHead>
            <TableHead className="hidden lg:table-cell">Categories</TableHead>
            <TableHead className="hidden sm:table-cell">Updated</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {quizzes.length > 0 ? (
            quizzes.map(quiz => (
              <TableRow key={quiz.id}>
                <TableCell className="font-medium">{quiz.name}</TableCell>
                <TableCell>${quiz.price.toFixed(2)}</TableCell>
                <TableCell className="hidden md:table-cell max-w-[300px] truncate">
                  {quiz.description}
                </TableCell>
                <TableCell className="hidden lg:table-cell max-w-[300px] truncate">
                  {formatCategoryDistribution(quiz.categoryDistribution)}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {new Date(quiz.updatedAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => onDelete(quiz.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onEdit(quiz)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                No quizzes found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default QuizTable;
