import React from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    FormControl,
    FormLabel,
    Input,
  } from '@chakra-ui/react';
  import useEditStudent from '../hooks/EditStudentHook';
  import { Student } from '../types/types';
  
  interface EditStudentModalProps {
    isOpen: boolean;
    onClose: () => void;
    studentId?: string;
    onStudentUpdate: (updatedStudent: Student) => void;
  }
  
  const EditStudentModal: React.FC<EditStudentModalProps> = ({ isOpen, onClose, studentId, onStudentUpdate }) => {
    const {
      student,
      loading,
      fetchStudent,
      handleSubmit,
      handleInputChange,
      setStudent
    } = useEditStudent(onClose, onStudentUpdate);
  
    React.useEffect(() => {
      if (isOpen && studentId) {
        fetchStudent(studentId);
      } else if (isOpen) {
        setStudent({ nama: '', kelas: '' });
      }
    }, [isOpen, studentId]);
  
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{studentId ? 'Edit Student' : 'Create Student'}</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit}>
            <ModalBody>
              <FormControl isRequired>
                <FormLabel>Nama</FormLabel>
                <Input
                  name="nama"
                  value={student.nama}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl isRequired mt="3">
                <FormLabel>Kelas</FormLabel>
                <Input
                  name="kelas"
                  value={student.kelas}
                  onChange={handleInputChange}
                />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button type="submit" colorScheme="blue" mr={3} isLoading={loading}>
                {studentId ? 'Update' : 'Create'}
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    );
  };
  
  export default EditStudentModal;