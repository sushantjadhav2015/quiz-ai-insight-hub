
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const QuizHistoryHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold">Quiz History</h1>
        <p className="text-muted-foreground">Manage your quiz sessions, payments, and results</p>
      </div>
      <Button onClick={() => navigate('/dashboard')} className="mt-4 md:mt-0">
        Back to Dashboard
      </Button>
    </div>
  );
};

export default QuizHistoryHeader;
