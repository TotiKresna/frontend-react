import React from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Checkbox, Button } from '@chakra-ui/react';
import { FaEdit } from 'react-icons/fa';
import { Student, StudentSortKeys  } from '../types/types';

interface StudentTableProps {
  students: Student[];
  selectedStudents: string[];
  isSuperAdminOrAdmin: boolean;
  onOpenModal: (studentId?: string) => void;
  onSelectStudent: (id: string) => void;
  onSort: (key: StudentSortKeys ) => void;
}

const StudentTable: React.FC<StudentTableProps> = ({
  students,
  selectedStudents,
  isSuperAdminOrAdmin,
  onOpenModal,
  onSelectStudent,
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
                isChecked={selectedStudents.length === students.length}
                onChange={(e) =>
                  students.forEach(student => student._id && onSelectStudent(student._id))
                }
              />
            </Th>
          )}
          <Th >No</Th>
          <Th onClick={() => onSort('nama')}>Nama</Th>
          <Th onClick={() => onSort('kelas')}>Kelas</Th>
          {isSuperAdminOrAdmin && (<Th>Actions</Th>)}
        </Tr>
      </Thead>
      <Tbody>
        {students.map((student, index) => (
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
                <Button onClick={() => onOpenModal(student._id)} size="sm" colorScheme="blue" mr="2" leftIcon={<FaEdit />}>Edit</Button>
              </Td>
            )}
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default StudentTable;