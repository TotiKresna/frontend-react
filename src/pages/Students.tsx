import { Box, Button, Table, Thead, Tbody, Tr, Th, Td, Checkbox, useToast } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchStudents, deleteMultipleStudents } from '../api/students';
import Loader from '../components/Loader';
import useToaster from '../components/Toaster';

const Students = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToaster();

  useEffect(() => {
    fetchStudents()
      .then((response) => {
        setStudents(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  const handleSelectStudent = (id: string) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleDeleteMultiple = () => {
    deleteMultipleStudents(selectedStudents)
      .then(() => {
        setStudents((prev) => prev.filter((student) => !selectedStudents.includes(student._id)));
        setSelectedStudents([]);
        showToast('Success', 'Selected students deleted successfully', 'success');
      })
      .catch((error) => {
        console.error(error);
        showToast('Error', 'Failed to delete selected students', 'error');
      });
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Box p="1">
      <Button colorScheme="blue" as={Link} to="/students/create" >Create Student</Button>
      <Button colorScheme="red" ml="3" onClick={handleDeleteMultiple}>Delete Selected</Button>
      <Table variant="simple" mt="5">
        <Thead>
          <Tr>
            <Th>
              <Checkbox
                isChecked={selectedStudents.length === students.length}
                onChange={(e) =>
                  setSelectedStudents(e.target.checked ? students.map((student) => student._id) : [])
                }
              />
            </Th>
            <Th>ID</Th>
            <Th>Nama</Th>
            <Th>Kelas</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {students.map((student) => (
            <Tr key={student._id}>
              <Td>
                <Checkbox
                   isChecked={selectedStudents.includes(student._id.toString())}
                   onChange={() => handleSelectStudent(student._id.toString())}
                />
              </Td>
              <Td>{student._id}</Td>
              <Td>{student.nama}</Td>
              <Td>{student.kelas}</Td>
              <Td>
                <Button as={Link} to={`/students/${student._id}`} size="sm" colorScheme="blue" mr="2">Edit</Button>
                <Button as={Link} to={`/students/${student._id}`} size="sm" colorScheme="green">Detail</Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default Students;
