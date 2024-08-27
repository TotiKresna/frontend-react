import { useState } from 'react';
import { createStudent, getStudentById, updateStudent } from '../api/students';
import useToaster from '../components/Toaster';
import { Student } from '../types/types';

const useEditStudent = (onClose: () => void, onStudentUpdate: (updatedStudent: Student) => void) => {
  const [student, setStudent] = useState<Student>({ nama: '', kelas: '' });
  const [loading, setLoading] = useState(false);
  const { showToast } = useToaster();

  const fetchStudent = async (id: string) => {
    setLoading(true);
    try {
      const response = await getStudentById(id);
      setStudent(response.data);
    } catch (error) {
      console.error(error);
      showToast('Error', 'Failed to fetch student data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let updatedStudent;
      if (student._id) {
        updatedStudent = await updateStudent(student._id, student);
        showToast('Success', 'Student updated successfully', 'success');
      } else {
        updatedStudent = await createStudent(student);
        showToast('Success', 'Student created successfully', 'success');
      }
      onStudentUpdate(updatedStudent.data);
      onClose();
    } catch (error) {
      console.error(error);
      showToast('Error', `Failed to ${student._id ? 'update' : 'create'} student`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStudent(prev => ({ ...prev, [name]: value }));
  };

  return {
    student,
    loading,
    fetchStudent,
    handleSubmit,
    handleInputChange,
    setStudent
  };
};

export default useEditStudent;