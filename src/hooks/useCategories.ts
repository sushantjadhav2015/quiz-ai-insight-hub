
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCategories, createCategory, updateCategory as updateCategoryApi, deleteCategory as deleteCategoryApi } from '../api';
import { Category } from '../types';
import { toast } from './use-toast';

export const useCategories = () => {
  const queryClient = useQueryClient();

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 60000,
  });

  const addCategoryMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: (newCategory) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: "Category created",
        description: `"${newCategory.name}" has been created successfully.`
      });
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: updateCategoryApi,
    onSuccess: (updatedCategory) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: "Category updated",
        description: `"${updatedCategory.name}" has been updated successfully.`
      });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: deleteCategoryApi,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      
      const categoryToDelete = categories.find(c => c.id === variables);
      toast({
        title: "Category deleted",
        description: categoryToDelete 
          ? `"${categoryToDelete.name}" has been deleted.`
          : "Category has been deleted."
      });
    },
  });

  const addCategory = (category: Omit<Category, 'id' | 'createdBy' | 'questionCount'>) => {
    addCategoryMutation.mutate(category);
  };

  const updateCategory = (category: Category) => {
    updateCategoryMutation.mutate(category);
  };

  const deleteCategory = (categoryId: string) => {
    deleteCategoryMutation.mutate(categoryId);
  };

  return {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
  };
};
