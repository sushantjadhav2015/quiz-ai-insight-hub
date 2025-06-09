
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';

const EmptyQuizHistory: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center py-12">
      <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-2">No quiz history yet</h3>
      <p className="text-muted-foreground mb-6">You haven't taken any quizzes or made any payments yet.</p>
      <div className="flex gap-4 justify-center">
        <Button onClick={() => navigate('/quiz/info')}>
          Start Your First Quiz
        </Button>
        <Button variant="outline" onClick={() => navigate('/quiz/list')}>
          Browse Quiz List
        </Button>
      </div>
    </div>
  );
};

export default EmptyQuizHistory;
