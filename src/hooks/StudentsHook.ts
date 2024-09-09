import { useState, useEffect } from 'react';
import { fetchStudents, deleteMultipleStudents } from '../api/students';
import useToaster from '../components/Toaster';
import { Student, StudentSortKeys } from '../types/types';
import { WarningAlert, DeleteConfirmationAlert } from '../components/SweetAlert';

const useStudents = () => {
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: StudentSortKeys; direction: 'ascending' | 'descending' } | null>(null);
  const { showToast } = useToaster();
  const [userRole, setUserRole] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState<string | undefined>(undefined);

  useEffect(() => {
    fetchStudents()
      .then((response) => {
        setAllStudents(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
    const storedUserRole = localStorage.getItem('role');
    if (storedUserRole) setUserRole(storedUserRole);
  }, []);

  const handleOpenModal = (studentId?: string) => {
    setEditingStudentId(studentId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStudentId(undefined);
  };

  const handleStudentUpdate = (updatedStudent: Student) => {
    setAllStudents(prevStudents => {
      if (updatedStudent._id) {
        return prevStudents.map(student => 
          student._id === updatedStudent._id ? updatedStudent : student
        );
      } else {
        return [...prevStudents, updatedStudent];
      }
    });
  };

  const handleSelectAllStudents = (isSelected: boolean) => {
    if (isSelected) {
      const allStudentIds = allStudents.map(student => student._id).filter((id): id is string => id !== undefined);
      setSelectedStudents(allStudentIds);
    } else {
      setSelectedStudents([]);
    }
  };

  const handleSelectStudent = (id: string) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleDeleteMultiple = () => {
    if (selectedStudents.length === 0) {
      WarningAlert({ text: 'Anda belum memilih data' });
    } else {
      DeleteConfirmationAlert({
        onConfirm: () => {
          deleteMultipleStudents(selectedStudents)
            .then(() => {
              setAllStudents((prev) => prev.filter((student) => student._id && !selectedStudents.includes(student._id)));
              setSelectedStudents([]);
              showToast('Success', 'Selected students deleted successfully', 'success');
            })
            .catch((error) => {
              console.error(error);
              showToast('Error', 'Failed to delete selected students', 'error');
            });
        },
        itemName: `${selectedStudents.length} student${selectedStudents.length > 1 ? 's' : ''}`
      });
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSort = (key: StudentSortKeys) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchStudents()
      .then((response) => {
        setAllStudents(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  const sortedStudents = [...allStudents].sort((a, b) => {
    if (sortConfig !== null) {
      const { key } = sortConfig;
      if (a[key] < b[key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
    }
    return 0;
  });

  const filteredStudents = sortedStudents.filter((student) =>
    student.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);

  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return {
    allStudents,
    currentStudents,
    loading,
    selectedStudents,
    searchTerm,
    currentPage,
    totalPages,
    isModalOpen,
    editingStudentId,
    userRole,
    handleRefresh,
    handleOpenModal,
    handleCloseModal,
    handleStudentUpdate,
    handleDeleteMultiple,
    handleSearch,
    handlePageChange,
    handleSelectStudent,
    handleSelectAllStudents,
    handleSort,
  };
};

export default useStudents;