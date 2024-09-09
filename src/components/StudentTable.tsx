import React from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Checkbox, Button } from '@chakra-ui/react';
import { FaEdit } from 'react-icons/fa';
import { Student, StudentSortKeys } from '../types/types';

interface StudentTableProps {
  currentStudents: Student[];
  allStudents: Student[];
  selectedStudents: string[];
  isSuperAdminOrAdmin: boolean;
  onOpenModal: (studentId?: string) => void;
  onSelectStudent: (id: string) => void;
  onSelectAllStudents: (isSelected: boolean) => void;
  onSort: (key: StudentSortKeys) => void;
}

const StudentTable: React.FC<StudentTableProps> = ({
  currentStudents,
  allStudents,
  selectedStudents,
  isSuperAdminOrAdmin,
  onOpenModal,
  onSelectStudent,
  onSelectAllStudents,
  onSort,
}) => {
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
          <Th onClick={() => onSort('nama')}>Nama</Th>
          <Th onClick={() => onSort('kelas')}>Kelas</Th>
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
            <Td>{index + 1}</Td>
            <Td>{student.nama}</Td>
            <Td>{student.kelas}</Td>
            {isSuperAdminOrAdmin && (
              <Td>
                <Button onClick={() => student._id && onOpenModal(student._id)} size="sm" colorScheme="blue" mr="2" leftIcon={<FaEdit />}>Edit</Button>
              </Td>
            )}
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default StudentTable;