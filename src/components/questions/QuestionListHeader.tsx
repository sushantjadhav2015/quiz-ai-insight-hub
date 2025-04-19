
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface QuestionListHeaderProps {
  onAddNew: () => void;
}

const QuestionListHeader = ({ onAddNew }: QuestionListHeaderProps) => {
  const navigate = useNavigate();

  return (
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
        <Button onClick={onAddNew}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Question
        </Button>
      </div>
    </div>
  );
};

export default QuestionListHeader;
