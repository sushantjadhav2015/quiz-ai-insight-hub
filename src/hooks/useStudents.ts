
import { useQuery } from '@tanstack/react-query';
import { getStudents } from '../api';
import { Student } from '../types';

export const useStudents = () => {
  const { data: students = [] } = useQuery({
    queryKey: ['students'],
    queryFn: getStudents,
    staleTime: 60000,
  });

  const getStudentById = (id: string) => {
    return students.find(student => student.id === id);
  };

  return {
    students,
    getStudentById,
  };
};
