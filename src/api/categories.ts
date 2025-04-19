
import { Category } from '../types';
import { delay } from './utils';
import categoriesData from '../data/categories.json';

export const getCategories = async (): Promise<Category[]> => {
  await delay(400);
  return categoriesData as Category[];
};

export const getCategoryById = async (id: string): Promise<Category> => {
  await delay(300);
  const category = categoriesData.find(c => c.id === id);
  
  if (!category) {
    throw new Error("Category not found");
  }
  
  return category as Category;
};

export const createCategory = async (category: Omit<Category, 'id' | 'createdBy' | 'questionCount'>): Promise<Category> => {
  await delay(600);
  
  return {
    ...category,
    id: (categoriesData.length + 1).toString(),
    createdBy: "1",
    questionCount: 0
  } as Category;
};

export const updateCategory = async (category: Category): Promise<Category> => {
  await delay(500);
  return category;
};

export const deleteCategory = async (id: string): Promise<void> => {
  await delay(500);
};
