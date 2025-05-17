
// Re-export existing types
export * from '../types';

// Add Quiz related types
export interface Quiz {
  id: string;
  name: string;
  price: number;
  description: string;
  categoryDistribution: CategoryPercentage[];
  createdAt: string;
  updatedAt: string;
}

export interface CategoryPercentage {
  categoryId: string;
  percentage: number;
}
