
import React from 'react';
import { Quiz } from '@/types/quiz';
import { Category } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, ListChecks, Percent, DollarSign } from 'lucide-react';

interface QuizCardProps {
  quiz: Quiz;
  categories: Category[];
  onEdit: (quiz: Quiz) => void;
  onDelete: (id: string) => void;
}

const QuizCard: React.FC<QuizCardProps> = ({ quiz, categories, onEdit, onDelete }) => {
  // Find category names from IDs
  const getCategoryName = (categoryId: string): string => {
    return categories.find(c => c.id === categoryId)?.name || 'Unknown Category';
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-start">
          <span>{quiz.name}</span>
          <span className="text-lg font-semibold text-primary">
            ${quiz.price.toFixed(2)}
          </span>
        </CardTitle>
        <CardDescription>{quiz.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center">
              <ListChecks className="h-4 w-4 mr-1" />
              Categories
            </h4>
            <div className="space-y-2">
              {quiz.categoryDistribution.map((dist) => (
                <div key={dist.categoryId} className="flex justify-between items-center text-sm">
                  <span>{getCategoryName(dist.categoryId)}</span>
                  <span className="font-medium flex items-center">
                    {dist.percentage}%
                    <Percent className="h-3 w-3 ml-0.5" />
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            Last updated: {new Date(quiz.updatedAt).toLocaleDateString()}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="ghost" size="icon" onClick={() => onDelete(quiz.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => onEdit(quiz)}>
          <Pencil className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuizCard;
