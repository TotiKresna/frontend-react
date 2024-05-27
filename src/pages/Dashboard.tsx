import React, { useEffect, useState } from 'react';
import { Box, SimpleGrid, Text, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import { Bar } from 'react-chartjs-2';
import Loader from '../components/Loader';
import { fetchTestResults } from '../api/testResults';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestResults()
      .then((response) => {
        setTestResults(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Loader />;
  }

  const opmFields = ['opm_tambah', 'opm_kurang', 'opm_kali', 'opm_bagi'];
  const chartData = opmFields.map((field) => ({
    labels: testResults.map((result) => result.student_id),
    datasets: [
      {
        label: field,
        data: testResults.map((result) => result[field]),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  }));

  const stats = opmFields.map((field) => {
    const values = testResults.map((result) => result[field]);
    return {
      field,
      totalStudents: values.length,
      average: (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2),
      min: Math.min(...values),
      max: Math.max(...values),
    };
  });

  return (
    <Box p="5">
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
        {chartData.map((data, index) => (
          <Box key={index}height="400px">
            <Text>{opmFields[index]}</Text>
            <Bar data={data} options={{ responsive: true, maintainAspectRatio: false }} />
          </Box>
        ))}
      </SimpleGrid>
      <Table variant="simple" mt="10">
        <Thead>
          <Tr>
            <Th>Jenis Operasi</Th>
            <Th>Jumlah Siswa</Th>
            <Th>Rata-rata Nilai</Th>
            <Th>Nilai Terendah</Th>
            <Th>Nilai Tertinggi</Th>
          </Tr>
        </Thead>
        <Tbody>
          {stats.map((stat, index) => (
            <Tr key={index}>
              <Td>{stat.field}</Td>
              <Td>{stat.totalStudents}</Td>
              <Td>{stat.average}</Td>
              <Td>{stat.min}</Td>
              <Td>{stat.max}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default Dashboard;
