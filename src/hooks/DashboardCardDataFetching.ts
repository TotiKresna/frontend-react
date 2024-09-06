import { useState, useEffect } from 'react';
import { TestResult, Student } from '../types/types';
import { fetchTestResults } from '../api/testResults';
import { fetchStudents } from '../api/students';

export const useDataFetching = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([fetchTestResults(), fetchStudents()])
      .then(([testResponse, studentResponse]) => {
        setTestResults(testResponse.data);
        setStudents(studentResponse.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError('Failed to fetch data');
        setLoading(false);
      });
  }, []);

  return { students, testResults, loading, error };
};