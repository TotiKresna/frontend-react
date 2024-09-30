import React from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Checkbox, Button, Flex } from '@chakra-ui/react';
import { FaEdit } from 'react-icons/fa';
import { TriangleUpIcon, TriangleDownIcon } from '@chakra-ui/icons';
import { Student, StudentSortKeys } from '../types/types';

interface StudentTableProps {
  currentStudents: Student[];
  allStudents: Student[];
  indexOfFirstStudent: number;
  selectedStudents: string[];
  isSuperAdminOrAdmin: boolean;
  onOpenModal: (studentId?: string) => void;
  onSelectStudent: (id: string) => void;
  onSelectAllStudents: (isSelected: boolean) => void;
  onSort: (key: StudentSortKeys) => void;
  sortKey: StudentSortKeys | null;
  sortOrder: 'asc' | 'desc';
}

const StudentTable: React.FC<StudentTableProps> = ({
  currentStudents,
  allStudents,
  indexOfFirstStudent,
  selectedStudents,
  isSuperAdminOrAdmin,
  onOpenModal,
  onSelectStudent,
  onSelectAllStudents,
  onSort,
  sortKey,
  sortOrder,
}) => {

  const SortIcon = ({ columnKey }: { columnKey: StudentSortKeys }) => {
    if (sortKey !== columnKey) return null;
    return sortOrder === 'asc' ? <TriangleUpIcon ml={1} /> : <TriangleDownIcon ml={1} />;
  };

  return (
    <Table variant="simple" mt="5" size="sm">
      <Thead>
        <Tr>
          {isSuperAdminOrAdmin && (
            <Th>
              <Checkbox 
                colorScheme='green'
                isChecked={selectedStudents.length === allStudents.length && allStudents.length > 0}
                isIndeterminate={selectedStudents.length > 0 && selectedStudents.length < allStudents.length}
                onChange={(e) => onSelectAllStudents(e.target.checked)}
              />
            </Th>
          )}
          <Th>No</Th>
          <Th onClick={() => onSort('nama')} cursor="pointer">
            <Flex alignItems="center">
              Nama
              <SortIcon columnKey="nama" />
            </Flex>
          </Th>
          <Th onClick={() => onSort('kelas')} cursor="pointer">
            <Flex alignItems="center">
              Kelas
              <SortIcon columnKey="kelas" />
            </Flex>
          </Th>
          {isSuperAdminOrAdmin && (<Th>Actions</Th>)}
        </Tr>
      </Thead>
      <Tbody>
        {currentStudents.map((student, index) => (
          <Tr key={student._id}>
            {isSuperAdminOrAdmin && (
              <Td>
                <Checkbox
                  colorScheme='red'
                  isChecked={student._id ? selectedStudents.includes(student._id) : false}
                  onChange={() => student._id && onSelectStudent(student._id)}
                />
              </Td>
            )}
            <Td>{indexOfFirstStudent + index + 1}</Td>
            <Td>{student.nama}</Td>
            <Td>{student.kelas}</Td>
            {isSuperAdminOrAdmin && (
              <Td>
                <Button aria-label="edit-student" onClick={() => student._id && onOpenModal(student._id)} size="sm" colorScheme="blue" mr="2" leftIcon={<FaEdit />}>Edit</Button>
              </Td>
            )}
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default StudentTable;