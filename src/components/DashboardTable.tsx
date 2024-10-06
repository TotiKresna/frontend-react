import React, { useState } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  Box,
  Icon,
  useColorModeValue,
  Text,
} from '@chakra-ui/react';
import { TriangleUpIcon, TriangleDownIcon } from '@chakra-ui/icons';
import { TestResult } from '../types/types';

interface TopStudentsTableProps {
  students: TestResult[];
}

type SortField = keyof TestResult | 'opm_total';

const TopStudentsTable: React.FC<TopStudentsTableProps> = ({ students }) => {
  const [sortField, setSortField] = useState<SortField>('opm_total');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const bgColor = useColorModeValue('whiteAlpha.800', 'gray.900');
  const tableHeadBgColor = useColorModeValue('teal.100', 'blackAlpha.600');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBgColor = useColorModeValue('teal.100', 'teal.400');

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getSortValue = (student: TestResult, field: SortField): number | string => {
    if (field === 'opm_total') {
      return student.opm_total ?? 0;
    }
    if (field === 'nama' || field === 'kelas') {
      return student.student_id?.[field] ?? student[field] ?? '';
    }
    const value = student[field as keyof TestResult];
    if (typeof value === 'string' || typeof value === 'number') {
      return value;
    }
    return '';
  };

  const formatOpmValue = (value: string | number): string => {
    const numValue = Number(value);
    return isNaN(numValue) ? '0.00' : numValue.toFixed(2);
  };

  const sortedStudents = [...students].sort((a, b) => {
    const aValue = getSortValue(a, sortField);
    const bValue = getSortValue(b, sortField);

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }

    return sortDirection === 'asc' 
      ? String(aValue).localeCompare(String(bValue))
      : String(bValue).localeCompare(String(aValue));
  });

  return (
    <Box overflowX="auto" borderRadius="lg" boxShadow="md" bg={bgColor}>
      <Table variant="striped">
        <TableCaption placement="top" textAlign="left" fontSize={{ base: "lg", md: "xl" }} fontWeight="bold" mb={4}>
          <Text>👑  Top 10 Siswa Nilai Tertinggi  👑 </Text>
        </TableCaption>
        <Thead bgColor={tableHeadBgColor}>
          <Tr>
            <Th borderBottom={`2px solid ${borderColor}`}>No</Th>
            <Th borderBottom={`2px solid ${borderColor}`} cursor="pointer" onClick={() => handleSort('nama')}>
              Nama {sortField === 'nama' && <SortIcon direction={sortDirection} />}
            </Th>
            <Th borderBottom={`2px solid ${borderColor}`} cursor="pointer" onClick={() => handleSort('kelas')}>
              Kelas {sortField === 'kelas' && <SortIcon direction={sortDirection} />}
            </Th>
            <Th borderBottom={`2px solid ${borderColor}`} cursor="pointer" onClick={() => handleSort('opm_tambah')}>
              OPM Tambah {sortField === 'opm_tambah' && <SortIcon direction={sortDirection} />}
            </Th>
            <Th borderBottom={`2px solid ${borderColor}`} cursor="pointer" onClick={() => handleSort('opm_kurang')}>
              OPM Kurang {sortField === 'opm_kurang' && <SortIcon direction={sortDirection} />}
            </Th>
            <Th borderBottom={`2px solid ${borderColor}`} cursor="pointer" onClick={() => handleSort('opm_kali')}>
              OPM Kali {sortField === 'opm_kali' && <SortIcon direction={sortDirection} />}
            </Th>
            <Th borderBottom={`2px solid ${borderColor}`} cursor="pointer" onClick={() => handleSort('opm_bagi')}>
              OPM Bagi {sortField === 'opm_bagi' && <SortIcon direction={sortDirection} />}
            </Th>
            <Th borderBottom={`2px solid ${borderColor}`} cursor="pointer" onClick={() => handleSort('opm_total')}>
              OPM Total {sortField === 'opm_total' && <SortIcon direction={sortDirection} />}
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {sortedStudents.map((student, index) => (
            <Tr key={student._id} _hover={{ bg: hoverBgColor }}>
              <Td borderBottom={`1px solid ${borderColor}`}>{index + 1}</Td>
              <Td borderBottom={`1px solid ${borderColor}`}>{student.student_id?.nama ?? student.nama}</Td>
              <Td borderBottom={`1px solid ${borderColor}`}>{student.student_id?.kelas ?? student.kelas}</Td>
              <Td borderBottom={`1px solid ${borderColor}`}>{formatOpmValue(student.opm_tambah)}</Td>
              <Td borderBottom={`1px solid ${borderColor}`}>{formatOpmValue(student.opm_kurang)}</Td>
              <Td borderBottom={`1px solid ${borderColor}`}>{formatOpmValue(student.opm_kali)}</Td>
              <Td borderBottom={`1px solid ${borderColor}`}>{formatOpmValue(student.opm_bagi)}</Td>
              <Td borderBottom={`1px solid ${borderColor}`}>{formatOpmValue(student.opm_total ?? 0)}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

const SortIcon: React.FC<{ direction: 'asc' | 'desc' }> = ({ direction }) => (
  <Icon as={direction === 'asc' ? TriangleUpIcon : TriangleDownIcon} ml={1} />
);

export default TopStudentsTable;