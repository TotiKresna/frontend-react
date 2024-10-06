import React from 'react';
import {
  Box,
  SimpleGrid,
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
import OpmHistogramChart from '../components/DashboardChart';
import { useDataFetching } from '../hooks/DashboardCardDataFetching';
import { useStatsCalculation } from '../hooks/DashboardCardStatsCalculation';
import { CardContent } from '../components/DashboardCardContent';
import { useTopStudents } from '../hooks/DashboardTopStudentsTableHook';
import TopStudentsTable from '../components/DashboardTable';

const Dashboard = () => {
  const { students, testResults, loading, error } = useDataFetching();
  const stats = useStatsCalculation(students, testResults);
  const { students: topStudents, loading: topStudentsLoading, error: topStudentsError } = useTopStudents();

  const cardColors = [
    useColorModeValue('blue.50', 'blue.900'),
    useColorModeValue('green.50', 'green.900'),
    useColorModeValue('purple.50', 'purple.900'),
    useColorModeValue('pink.50', 'pink.900'),
  ];

  if (loading || topStudentsLoading) return <Loader />;
  if (error || topStudentsError) {
    return (
      <Alert status="error">
        <AlertIcon />
        <AlertTitle mr={2}>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Box p={5}>
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        <Box p={5} borderRadius="lg" boxShadow="md" bg={cardColors[0]} textAlign="center">
          <Heading size="sm" mb={4}>📊 Data Siswa dan Nilai Operasi Matematika (OPM)</Heading>
          <Flex direction={{ base: 'column', sm: 'row' }} justify="space-between" w="100%" mb={4}>
            <Stat flex="1" textAlign="center">
              <StatLabel fontWeight="bold">Total Siswa</StatLabel>
              <StatNumber>{("👨‍🎓 " + stats.totalStudents)}</StatNumber>
            </Stat>
            <Stat flex="1" textAlign="center">
              <StatLabel fontWeight="bold">Total Nilai Test</StatLabel>
              <StatNumber>{("📝 " + stats.totalTestScores)}</StatNumber>
            </Stat>
          </Flex>
          <CardContent title="✍🏻 Jumlah Test (Per-OPM)" data={stats.opmCounts} />
        </Box>

        <Box p={5} borderRadius="lg" boxShadow="md" bg={cardColors[1]} textAlign="center">
          <CardContent title="📉 Nilai OPM Terendah" data={stats.lowestScores} />
        </Box>

        <Box p={5} borderRadius="lg" boxShadow="md" bg={cardColors[2]} textAlign="center">
          <CardContent title="📈 Nilai OPM Tertinggi" data={stats.highestScores} />
        </Box>

        <Box p={5} borderRadius="lg" boxShadow="md" bg={cardColors[3]} textAlign="center">
          <CardContent title="📋 Rata-rata Nilai OPM" data={stats.averageScores} />
        </Box>
      </SimpleGrid>
      <Box mt={6}>
        <OpmHistogramChart />
      </Box>
      <Box mt={6}>
        <TopStudentsTable students={topStudents} />
      </Box>
    </Box>
  );
};

export default Dashboard;