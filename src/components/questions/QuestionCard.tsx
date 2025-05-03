
import React, { useState } from 'react';
import { Edit, Trash, Text } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Category, Question } from '@/types';
import { ScrollArea } from "@/components/ui/scroll-area";

interface QuestionCardProps {
  question: Question;
  category?: Category;
  onEdit: (question: Question) => void;
  onDelete: (id: string) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  category,
  onEdit,
  onDelete,
}) => {
  const [isTextExpanded, setIsTextExpanded] = useState(false);
  const isLongText = question.text.length > 150;
  
  const displayText = isLongText && !isTextExpanded 
    ? `${question.text.substring(0, 150)}...` 
    : question.text;

  return (
    <Card className="border border-muted">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex-1">
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
            <CardTitle className="text-base font-medium">
              {displayText}
              {isLongText && (
                <Button 
                  variant="link" 
                  size="sm" 
                  className="p-0 h-auto font-normal" 
                  onClick={() => setIsTextExpanded(!isTextExpanded)}
                >
                  {isTextExpanded ? "Show less" : "Show more"}
                </Button>
              )}
            </CardTitle>
          </div>
          <div className="flex space-x-1 ml-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(question)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-700"
              onClick={() => onDelete(question.id)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {question.options.map((option, index) => (
            <div 
              key={index}
              className={`p-3 border rounded-md ${
                index === question.correctOption 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-input'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-muted text-sm font-medium">
                  {String.fromCharCode(65 + index)}
                </span>
                <div className="flex-1">
                  {index === question.correctOption && (
                    <Badge className="mb-1 bg-green-500">Correct Answer</Badge>
                  )}
                  <p className="text-sm">{option}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {question.explanation && (
          <div className="mt-4 p-3 bg-muted rounded-md">
            <p className="text-sm font-medium">Explanation:</p>
            <ScrollArea className="max-h-40">
              <p className="text-sm text-muted-foreground">{question.explanation}</p>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuestionCard;
