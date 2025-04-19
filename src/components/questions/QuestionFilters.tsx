import React from 'react';
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import SearchableCategories from '@/components/categories/SearchableCategories';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category } from '@/types';

interface QuestionFiltersProps {
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  selectedDifficulty: string;
  setSelectedDifficulty: (value: string) => void;
  setCurrentPage: (value: number) => void;
  categories: Category[];
  handleClearFilters: () => void;
  filteredQuestionsCount: number;
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
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Label htmlFor="search" className="sr-only">Search</Label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search questions or answers..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
        
        <div className="w-full md:w-1/4">
          <SearchableCategories
            categories={categories}
            value={selectedCategory}
            onValueChange={(value) => {
              setSelectedCategory(value);
              setCurrentPage(1);
            }}
          />
        </div>
        
        <div className="w-full md:w-1/4">
          <Select 
            value={selectedDifficulty} 
            onValueChange={(value) => {
              setSelectedDifficulty(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Difficulties" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Difficulties</SelectItem>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {(searchQuery || selectedCategory !== 'all' || selectedDifficulty !== 'all') && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {filteredQuestionsCount} results found
          </div>
          <Button variant="ghost" size="sm" onClick={handleClearFilters}>
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default QuestionFilters;
