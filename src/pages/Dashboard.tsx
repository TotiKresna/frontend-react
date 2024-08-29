import React, { useEffect, useState } from 'react';
import {
  Box,
  SimpleGrid,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  Heading,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useColorModeValue,
  Flex,
} from '@chakra-ui/react';
import Loader from '../components/Loader';
import { TestResult } from '../types/types';
import { Student } from '../types/types';
import { fetchTestResults } from '../api/testResults';
import { fetchStudents } from '../api/students';
import OpmHistogramChart from '../components/Chart';

const Dashboard = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cardColors = [
    useColorModeValue('blue.50', 'blue.900'),
    useColorModeValue('green.50', 'green.900'),
    useColorModeValue('purple.50', 'purple.900'),
    useColorModeValue('pink.50', 'pink.900'),
  ];

  const dataColors = [
    useColorModeValue('blue.100', 'blue.700'),
    useColorModeValue('green.100', 'green.700'),
    useColorModeValue('yellow.100', 'yellow.700'),
    useColorModeValue('orange.100', 'orange.700'),
    useColorModeValue('red.100', 'red.700'),
  ];

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

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        <AlertTitle mr={2}>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  const opmFields = ['opm_tambah', 'opm_kurang', 'opm_kali', 'opm_bagi'] as const;

  const calculateStats = () => {
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
  };

  const stats = calculateStats();

  const CardContent = ({ title, data }: { title: string; data: Record<string, number> }) => (
    <Box>
      <Heading as="h3" size="md" mb={4}>
        {title}
      </Heading>
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={3}>
        {opmFields.map((field, index) => (
          <Box
            key={field}
            p={3}
            borderRadius="md"
            boxShadow="sm"
            bg={dataColors[index]}
            _hover={{ boxShadow: 'md', transform: 'translateY(-2px)' }}
            transition="all 0.2s"
          >
            <Text fontWeight="bold">{field.replace('opm_', 'OPM ')}</Text>
            <Text fontSize="xl">{data[field]}</Text>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );

  return (
    <Box p={5}>


      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        <Box p={5} borderRadius="lg" boxShadow="md" bg={cardColors[0]}>
          <Heading as="h4" size="md" mb={4}>Data Siswa dan Nilai Operasi Matematika</Heading>
          <Flex direction={{ base: 'column', sm: 'row' }} justify="space-between" w="100%" mb={4}>
            <Stat flex="1" textAlign="center">
              <StatLabel>Total Siswa</StatLabel>
              <StatNumber>{stats.totalStudents}</StatNumber>
            </Stat>
            <Stat flex="1" textAlign="center">
              <StatLabel>Total Nilai Test</StatLabel>
              <StatNumber>{stats.totalTestScores}</StatNumber>
            </Stat>
          </Flex>
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={3}>
            {opmFields.map((field, index) => (
              <Box
                key={field}
                p={3}
                borderRadius="md"
                boxShadow="sm"
                bg={dataColors[index]}
                _hover={{ boxShadow: 'md', transform: 'translateY(-2px)' }}
                transition="all 0.2s"
              >
                <Text fontWeight="bold">{field.replace('opm_', 'OPM ')}</Text>
                <Text fontSize="xl">{stats.opmCounts[field]}</Text>
              </Box>
            ))}
          </SimpleGrid>
        </Box>

        <Box p={5} borderRadius="lg" boxShadow="md" bg={cardColors[1]}>
          <CardContent title="Nilai OPM Terendah" data={stats.lowestScores} />
        </Box>

        <Box p={5} borderRadius="lg" boxShadow="md" bg={cardColors[2]}>
          <CardContent title="Nilai OPM Tertinggi" data={stats.highestScores} />
        </Box>

        <Box p={5} borderRadius="lg" boxShadow="md" bg={cardColors[3]}>
          <CardContent title="Rata-rata Nilai OPM" data={stats.averageScores} />
        </Box>
      </SimpleGrid>
      <Box mt={6}>
        <OpmHistogramChart />
      </Box>
    </Box>
  );
};

export default Dashboard;