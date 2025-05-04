
import React from 'react';
import { Table, List } from 'lucide-react';
import { Button } from "@/components/ui/button";

export type ViewMode = 'table' | 'cards';

interface ViewToggleProps {
  viewMode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ viewMode, onChange }) => {
  return (
    <div className="flex items-center space-x-2">
      <Button
        variant={viewMode === 'table' ? 'secondary' : 'outline'}
        size="sm"
        onClick={() => onChange('table')}
        className="h-8 w-8 p-0"
      >
        <Table className="h-4 w-4" />
      </Button>
      <Button
        variant={viewMode === 'cards' ? 'secondary' : 'outline'}
        size="sm"
        onClick={() => onChange('cards')}
        className="h-8 w-8 p-0"
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ViewToggle;
