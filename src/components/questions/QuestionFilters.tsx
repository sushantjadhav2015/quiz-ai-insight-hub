
import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category } from '@/types';
import ViewToggle, { ViewMode } from './ViewToggle';

interface QuestionFiltersProps {
  selectedCategory: string;
  setSelectedCategory: (categoryId: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedDifficulty: string;
  setSelectedDifficulty: (difficulty: string) => void;
  setCurrentPage: (page: number) => void;
  categories: Category[];
  handleClearFilters: () => void;
  filteredQuestionsCount: number;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

const QuestionFilters: React.FC<QuestionFiltersProps> = ({
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  selectedDifficulty,
  setSelectedDifficulty,
  setCurrentPage,
  categories,
  handleClearFilters,
  filteredQuestionsCount,
  viewMode,
  setViewMode,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9"
          />
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Select
            value={selectedCategory}
            onValueChange={(value) => {
              setSelectedCategory(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select
            value={selectedDifficulty}
            onValueChange={(value) => {
              setSelectedDifficulty(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
          
          <ViewToggle viewMode={viewMode} onChange={setViewMode} />
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {filteredQuestionsCount} {filteredQuestionsCount === 1 ? 'question' : 'questions'} found
        </div>
        
        {(searchQuery || selectedCategory !== 'all' || selectedDifficulty !== 'all') && (
          <Button variant="ghost" size="sm" onClick={handleClearFilters}>
            <Filter className="mr-2 h-4 w-4" />
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuestionFilters;
