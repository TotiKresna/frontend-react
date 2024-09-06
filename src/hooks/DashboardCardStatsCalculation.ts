import { useMemo } from 'react';
import { TestResult, Student } from '../types/types';

export const useStatsCalculation = (students: Student[], testResults: TestResult[]) => {
  const opmFields = ['opm_tambah', 'opm_kurang', 'opm_kali', 'opm_bagi'] as const;

  return useMemo(() => {
    const stats = {
      totalStudents: students.length,
      totalTestScores: 0,
      opmCounts: {} as Record<string, number>,
      lowestScores: {} as Record<string, number>,
      highestScores: {} as Record<string, number>,
      averageScores: {} as Record<string, number>,
    };

    opmFields.forEach(field => {
      const validValues = testResults
        .map(result => result[field])
        .filter((value): value is number => value !== null && value !== undefined);

      stats.opmCounts[field] = validValues.length;
      stats.totalTestScores += validValues.length;

      if (validValues.length > 0) {
        stats.lowestScores[field] = Math.min(...validValues);
        stats.highestScores[field] = Math.max(...validValues);
        stats.averageScores[field] = Number((validValues.reduce((a, b) => a + b, 0) / validValues.length).toFixed(2));
      } else {
        stats.lowestScores[field] = 0;
        stats.highestScores[field] = 0;
        stats.averageScores[field] = 0;
      }
    });

    return stats;
  }, [students, testResults]);
};