import React from 'react';
import { Box, Flex, Heading, Button, Input, Spacer } from '@chakra-ui/react';
import { FaPlus, FaTrash, FaFileExcel, FaFilePdf, FaSync } from 'react-icons/fa';
import useStudents from '../hooks/StudentsHook';
import StudentTable from '../components/StudentTable';
import Pagination from '../components/StudentPagination';
import EditStudentModal from '../modals/EditStudentModal';
import { exportToPDF, exportToExcel } from '../utils/StudentExport';
import Loader from '../components/Loader';

const Students: React.FC = () => {
  const {
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
  } = useStudents();

  const isSuperAdminOrAdmin = userRole === 'superadmin' || userRole === 'admin';

  if (loading) return <Loader />;

  return (
    <Box p={{ base: "4", md: "5", lg: "6" }}>
      <Flex mb="4" alignItems="center">
        <Heading size="lg">Data Siswa</Heading>
        <Button aria-label="Sync" ml="3" borderRadius="10" size="xs" colorScheme="teal" onClick={handleRefresh}>
          <FaSync />
        </Button>
        <Spacer />
        {isSuperAdminOrAdmin && (
          <Flex>
            <Button aria-label="create-student" size="sm" colorScheme="blue" onClick={() => handleOpenModal()} mr="3" leftIcon={<FaPlus />}>
              Create
            </Button>
            <Button aria-label="delete-student" size="sm" colorScheme="red" onClick={handleDeleteMultiple} leftIcon={<FaTrash />}>
              Delete
            </Button>
          </Flex>
        )}
      </Flex>
      <Flex mb="4" justifyContent="space-between" alignItems="center">
        <Input
          placeholder="Search by name"
          value={searchTerm}
          onChange={handleSearch}
          width="300px"
          mr="4"
        />
        <Flex>
          <Button size="sm" colorScheme="green" onClick={() => exportToExcel(allStudents)} mr="3" leftIcon={<FaFileExcel />}>
            Export Excel
          </Button>
          <Button size="sm" colorScheme="red" onClick={() => exportToPDF(allStudents)} leftIcon={<FaFilePdf />}>
            Export PDF
          </Button>
        </Flex>
      </Flex>
      <StudentTable 
        currentStudents={currentStudents}
        allStudents={allStudents}
        selectedStudents={selectedStudents}
        isSuperAdminOrAdmin={isSuperAdminOrAdmin}
        onOpenModal={handleOpenModal}
        onSelectStudent={handleSelectStudent}
        onSelectAllStudents={handleSelectAllStudents}
        onSort={handleSort}
      />
      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      <EditStudentModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        studentId={editingStudentId}
        onStudentUpdate={handleStudentUpdate}
      />
    </Box>
  );
};

export default Students;