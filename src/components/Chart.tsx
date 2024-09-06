import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Box, Heading, SimpleGrid, Text, useColorModeValue } from '@chakra-ui/react';
import { fetchTestResults } from '../api/testResults';

interface TestResult {
  student_id: string;
  opm_tambah: number | null;
  opm_kurang: number | null;
  opm_kali: number | null;
  opm_bagi: number | null;
  opm_total: number | null;
}

interface HistogramData {
  range: string;
  count: number;
}

const scoreRanges = [
  { min: 0, max: 10, color: 'black' },
  { min: 10, max: 20, color: 'red' },
  { min: 20, max: 30, color: 'orange' },
  { min: 30, max: 40, color: 'yellow' },
  { min: 40, max: 50, color: 'green' },
  { min: 50, max: 60, color: 'blue' },
  { min: 60, max: 70, color: 'purple' },
  { min: 70, max: Infinity, color: 'pink' },
];

const OpmHistogramChart: React.FC = () => {
  const [chartData, setChartData] = useState<Record<string, HistogramData[]>>({});
  const cardBg = useColorModeValue('whiteAlpha.500', 'gray.700');
  const tooltipBg = useColorModeValue('white', 'gray.500');
  const cardShadow = useColorModeValue('md', 'dark-lg');

  useEffect(() => {
    fetchTestResults().then((response) => {
      const results: TestResult[] = response.data;
      const data: Record<string, HistogramData[]> = {};

      const opmFields: (keyof TestResult)[] = ['opm_tambah', 'opm_kurang', 'opm_kali', 'opm_bagi'];

      opmFields.forEach((field) => {
        data[field] = scoreRanges.map((range) => ({
          range: `${range.min}-${range.max === Infinity ? '+' : range.max}`,
          count: results.filter((result) => {
            const value = result[field];
            return typeof value === 'number' && value >= range.min && value < range.max;
          }).length,
        }));
      });

      setChartData(data);
    });
  }, []);

  const CustomTooltip: React.FC<{
    active?: boolean;
    payload?: Array<{ value: number }>;
    label?: string;
  }> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box bg={tooltipBg} p={2} border="1px solid #ccc">
          <Text>{`Range: ${label}`}</Text>
          <Text>{`Jumlah siswa: ${payload[0].value}`}</Text>
        </Box>
      );
    }
    return null;
  };

  const renderChart = (field: string) => (
    <Box
      key={field}
      p={5}
      borderRadius="lg"
      boxShadow={cardShadow}
      bg={cardBg}
      height="300px"
    >
      <Heading as="h5" size="sm" mb={4}>
        {field.replace('opm_', 'Operasi ').toUpperCase()}
      </Heading>
      <ResponsiveContainer width="100%" height="80%">
        <BarChart data={chartData[field]}>
          <XAxis dataKey="range" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count">
            {chartData[field]?.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={scoreRanges[index].color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );

  return (
    <Box p={5}>
      <Heading as="h4" size="lg" mb={6}>Histogram Skor Operasi Matematika</Heading>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {Object.keys(chartData).map(renderChart)}
      </SimpleGrid>
    </Box>
  );
};

export default OpmHistogramChart;
