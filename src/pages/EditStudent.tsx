import { Box, Button, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchStudents, createStudent, updateStudent } from '../api/students';
import useToaster from '../components/Toaster';
import Loader from '../components/Loader';

const EditStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState({ nama: '', kelas: '' });
  const [loading, setLoading] = useState(true);
  const { showToast } = useToaster();

  useEffect(() => {
    if (id) {
      fetchStudents()
        .then((response) => {
          const foundStudent = response.data.find((student: any) => student.id === parseInt(id));
          setStudent(foundStudent);
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (id) {
      updateStudent(parseInt(id), student)
        .then(() => {
          showToast('Success', 'Student updated successfully', 'success');
          navigate('/students');
        })
        .catch((error) => {
          console.error(error);
          showToast('Error', 'Failed to update student', 'error');
        });
    } else {
      createStudent(student)
        .then(() => {
          showToast('Success', 'Student created successfully', 'success');
          navigate('/students');
        })
        .catch((error) => {
          console.error(error);
          showToast('Error', 'Failed to create student', 'error');
        });
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Box p="5">
      <form onSubmit={handleSubmit}>
        <FormControl isRequired>
          <FormLabel>Nama</FormLabel>
          <Input
            type="text"
            value={student.nama}
            onChange={(e) => setStudent({ ...student, nama: e.target.value })}
          />
        </FormControl>
        <FormControl isRequired mt="3">
          <FormLabel>Kelas</FormLabel>
          <Input
            type="text"
            value={student.kelas}
            onChange={(e) => setStudent({ ...student, kelas: e.target.value })}
          />
        </FormControl>
        <Button type="submit" mt="5" colorScheme="blue">
          {id ? 'Update' : 'Create'}
        </Button>
      </form>
    </Box>
  );
};

export default EditStudent;
