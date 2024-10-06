import { useState, useEffect } from 'react';
import axios from 'axios';
import { TestResult } from '../types/types';

export const useTopStudents = () => {
  const [students, setStudents] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopStudents = async () => {
      try {
        const response = await axios.get<TestResult[]>(`${process.env.REACT_APP_API_URL}/api/test-results`);
        const processedStudents = response.data.map(student => ({
          ...student,
          opm_tambah: Number(student.opm_tambah),
          opm_kurang: Number(student.opm_kurang),
          opm_kali: Number(student.opm_kali),
          opm_bagi: Number(student.opm_bagi),
          opm_total: Number(student.opm_tambah) + Number(student.opm_kurang) + 
                     Number(student.opm_kali) + Number(student.opm_bagi)
        }));

        const sortedStudents = processedStudents.sort((a, b) => (b.opm_total ?? 0) - (a.opm_total ?? 0));
        const topTenStudents = sortedStudents.slice(0, 10);

        setStudents(topTenStudents);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch student data');
        setLoading(false);
      }
    };

    fetchTopStudents();
  }, []);

  return { students, loading, error };
};