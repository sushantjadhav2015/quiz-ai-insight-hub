
import { Student } from '../types';
import { delay } from './utils';
import usersData from '../data/users.json';

export const getStudents = async (): Promise<Student[]> => {
  await delay(300);
  return usersData.filter(user => user.role === 'student') as Student[];
};

export const getStudentById = async (id: string): Promise<Student | null> => {
  await delay(200);
  const student = usersData.find(user => user.id === id && user.role === 'student');
  
  if (!student) {
    return null;
  }
  
  return student as Student;
};
