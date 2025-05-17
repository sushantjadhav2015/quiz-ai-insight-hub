import React, { useState, useEffect } from 'react';
import { Category, Quiz, CategoryPercentage } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Slider } from '@/components/ui/slider';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  price: z.coerce.number().min(0, 'Price must be non-negative'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  categoryDistribution: z.array(
    z.object({
      categoryId: z.string(),
      percentage: z.number().min(0).max(100)
    })
  ).refine(items => {
    // Check if any categories are selected
    if (items.length === 0) return false;
    
    // Check total percentage
    const total = items.reduce((sum, item) => sum + item.percentage, 0);
    return total === 100;
  }, {
    message: "Total percentage must equal 100%"
  })
});

interface QuizFormProps {
  categories: Category[];
  initialData?: Quiz;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const QuizForm: React.FC<QuizFormProps> = ({ categories, initialData, onSubmit, onCancel }) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [percentages, setPercentages] = useState<Record<string, number>>({});
  const [totalPercentage, setTotalPercentage] = useState(0);

  // Set up react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      name: initialData.name,
      price: initialData.price,
      description: initialData.description,
      categoryDistribution: initialData.categoryDistribution,
    } : {
      name: '',
      price: 0,
      description: '',
      categoryDistribution: [],
    },
  });

  // Initialize state if editing an existing quiz
  useEffect(() => {
    if (initialData) {
      const selected = initialData.categoryDistribution.map(cd => cd.categoryId);
      setSelectedCategories(selected);
      
      const percents: Record<string, number> = {};
      let total = 0;
      
      initialData.categoryDistribution.forEach(cd => {
        percents[cd.categoryId] = cd.percentage;
        total += cd.percentage;
      });
      
      setPercentages(percents);
      setTotalPercentage(total);
    }
  }, [initialData]);

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => {
      // If category is already selected, remove it
      if (prev.includes(categoryId)) {
        // Also remove its percentage
        const newPercentages = { ...percentages };
        delete newPercentages[categoryId];
        setPercentages(newPercentages);
        
        // Recalculate total percentage
        const newTotal = Object.values(newPercentages).reduce((sum, val) => sum + val, 0);
        setTotalPercentage(newTotal);
        
        return prev.filter(id => id !== categoryId);
      } 
      // Otherwise add it with 0% initially
      else {
        setPercentages(prev => ({ ...prev, [categoryId]: 0 }));
        return [...prev, categoryId];
      }
    });
  };

  const handlePercentageChange = (categoryId: string, value: number[]) => {
    const newPercentage = value[0];
    setPercentages(prev => ({ ...prev, [categoryId]: newPercentage }));
    
    // Calculate new total
    const newTotal = Object.entries(percentages)
      .map(([id, val]) => id === categoryId ? newPercentage : val)
      .reduce((sum, val) => sum + val, 0);
      
    setTotalPercentage(newTotal);
  };

  const handleFormSubmit = (values: z.infer<typeof formSchema>) => {
    // Prepare category distribution data
    const categoryDistribution = selectedCategories.map(categoryId => ({
      categoryId,
      percentage: percentages[categoryId]
    }));
    
    onSubmit({
      ...values,
      categoryDistribution
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quiz Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter quiz name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price ($)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="0" 
                  step="0.01" 
                  placeholder="29.99" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe what this quiz is about" 
                  className="min-h-[100px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <Label>Categories</Label>
          <p className="text-sm text-muted-foreground">
            Select categories and assign percentage of questions from each
          </p>
          
          <div className="grid gap-4">
            {categories.map((category) => (
              <div key={category.id} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id={`category-${category.id}`}
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={() => handleCategoryToggle(category.id)}
                  />
                  <Label 
                    htmlFor={`category-${category.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {category.name}
                  </Label>
                </div>
                
                {selectedCategories.includes(category.id) && (
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Slider
                        value={[percentages[category.id] || 0]}
                        max={100}
                        step={5}
                        onValueChange={(value) => handlePercentageChange(category.id, value)}
                      />
                    </div>
                    <div className="w-12 text-right">
                      {percentages[category.id] || 0}%
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <span className="font-medium">Total Percentage:</span>
            <span className={cn(
              "font-bold",
              totalPercentage > 100 ? "text-red-500" :
              totalPercentage === 100 ? "text-green-500" : ""
            )}>
              {totalPercentage}%
            </span>
          </div>
          
          {totalPercentage !== 100 && (
            <Alert variant="destructive">
              <AlertDescription>
                Total percentage must equal exactly 100%. 
                {totalPercentage > 100 ? " Please reduce some percentages." : " Please increase some percentages."}
              </AlertDescription>
            </Alert>
          )}
          
          {selectedCategories.length === 0 && (
            <Alert variant="destructive">
              <AlertDescription>
                Please select at least one category.
              </AlertDescription>
            </Alert>
          )}
        </div>
        
        <div className="flex justify-end gap-4 mt-6">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={totalPercentage !== 100 || selectedCategories.length === 0}
          >
            {initialData ? 'Update Quiz' : 'Create Quiz'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default QuizForm;
