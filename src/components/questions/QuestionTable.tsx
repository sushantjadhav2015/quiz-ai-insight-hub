
import React from 'react';
import { Edit, Trash, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Category, Question } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import TruncatedText from '@/components/ui/truncated-text';

interface QuestionTableProps {
  questions: Question[];
  categories: Category[];
  onEdit: (question: Question) => void;
  onDelete: (id: string) => void;
}

const QuestionTable: React.FC<QuestionTableProps> = ({
  questions,
  categories,
  onEdit,
  onDelete,
}) => {
  const [expandedRows, setExpandedRows] = React.useState<Record<string, boolean>>({});

  const toggleRow = (id: string) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px]"></TableHead>
            <TableHead>Question</TableHead>
            <TableHead className="w-[150px]">Category</TableHead>
            <TableHead className="w-[120px]">Difficulty</TableHead>
            <TableHead className="text-right w-[120px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {questions.map((question) => {
            const isExpanded = expandedRows[question.id];
            const category = categories.find(c => c.id === question.categoryId);
            
            return (
              <React.Fragment key={question.id}>
                <TableRow>
                  <TableCell className="p-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => toggleRow(question.id)}
                      className="h-8 w-8 p-0"
                    >
                      {isExpanded ? 
                        <ChevronUp className="h-4 w-4" /> : 
                        <ChevronDown className="h-4 w-4" />
                      }
                    </Button>
                  </TableCell>
                  <TableCell className="font-medium">
                    <div>
                      <TruncatedText 
                        text={question.text} 
                        showMoreButton={true}
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{category?.name || 'Unknown'}</Badge>
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
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
                  </TableCell>
                </TableRow>
                
                {isExpanded && (
                  <TableRow>
                    <TableCell colSpan={5} className="bg-muted/30 p-4">
                      <div className="space-y-4">
                        <ScrollArea className="max-h-96">
                          <div className="space-y-2">
                            <h4 className="font-medium text-sm mb-2">Options:</h4>
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
                                    <p className="text-sm">
                                      <TruncatedText 
                                        text={option}
                                        showMoreButton={false}
                                        isOption={true}
                                      />
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          {question.explanation && (
                            <div className="mt-4 p-3 bg-muted rounded-md">
                              <p className="text-sm font-medium">Explanation:</p>
                              <p className="text-sm text-muted-foreground">
                                <TruncatedText 
                                  text={question.explanation}
                                  showMoreButton={true} 
                                />
                              </p>
                            </div>
                          )}
                        </ScrollArea>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            );
          })}
          
          {questions.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No questions found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default QuestionTable;
