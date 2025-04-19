import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import SearchableCategories from '@/components/categories/SearchableCategories';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, Plus } from 'lucide-react';

interface QuestionFormProps {
  categories: any[];
  newQuestion: {
    text: string;
    categoryId: string;
    options: string[];
    correctOption: number;
    difficulty: 'easy' | 'medium' | 'hard';
    explanation: string;
  };
  isEditing: boolean;
  onQuestionChange: (field: string, value: any) => void;
  onOptionChange: (index: number, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const QuestionForm: React.FC<QuestionFormProps> = ({
  categories,
  newQuestion,
  isEditing,
  onQuestionChange,
  onOptionChange,
  onSubmit,
  onCancel,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <SearchableCategories
          categories={categories}
          value={newQuestion.categoryId}
          onValueChange={(value) => onQuestionChange('categoryId', value)}
          placeholder="Select a category"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="question">Question Text</Label>
        <Textarea
          id="question"
          placeholder="Enter the question text"
          value={newQuestion.text}
          onChange={(e) => onQuestionChange('text', e.target.value)}
          required
          className="min-h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <Label>Options</Label>
        {newQuestion.options.map((option, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Input
              placeholder={`Option ${index + 1}`}
              value={option}
              onChange={(e) => onOptionChange(index, e.target.value)}
              required
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onQuestionChange('correctOption', index)}
              className={newQuestion.correctOption === index ? "border-green-500" : ""}
            >
              {newQuestion.correctOption === index ? "Correct" : "Set Correct"}
            </Button>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <Label htmlFor="difficulty">Difficulty</Label>
        <Select 
          value={newQuestion.difficulty} 
          onValueChange={(value: 'easy' | 'medium' | 'hard') => 
            onQuestionChange('difficulty', value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="easy">Easy</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="hard">Hard</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="explanation">Explanation (Optional)</Label>
        <Textarea
          id="explanation"
          placeholder="Provide an explanation for the correct answer"
          value={newQuestion.explanation}
          onChange={(e) => onQuestionChange('explanation', e.target.value)}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {isEditing ? (
            <>
              <Save className="mr-2 h-4 w-4" />
              Update Question
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Add Question
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default QuestionForm;
