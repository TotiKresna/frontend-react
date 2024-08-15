import { Box, Button, Table, Thead, Tbody, Tr, Th, Td, Checkbox, Flex, Heading, Input } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchStudents, deleteMultipleStudents } from '../api/students';
import Loader from '../components/Loader';
import useToaster from '../components/Toaster';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { FaPlus, FaTrash, FaFileExcel, FaFilePdf, FaEdit } from 'react-icons/fa';

const Students = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'ascending' | 'descending' } | null>(null);
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

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [['No', 'Nama', 'Kelas']],
      body: students.map((student, index) => [
        index + 1,
        student.nama,
        student.kelas,
      ]),
    });
    doc.save('students.pdf');
  };

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      students.map((student, index) => ({
        No: index + 1,
        Nama: student.nama,
        Kelas: student.kelas,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');
    XLSX.writeFile(workbook, 'students.xlsx');
  };

  const handleSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedStudents = [...students].sort((a, b) => {
    if (sortConfig !== null) {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
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

  if (loading) {
    return <Loader />;
  }

  return (
    <Box p={{ base: "4", md: "5", lg: "6" }}>
      <Flex mb="4" justifyContent="space-between" alignItems="center">
        <Heading size="lg">Data Siswa</Heading>
        <Flex>
          <Button size="sm" colorScheme="blue" as={Link} to="/students/create" mr="3" leftIcon={<FaPlus />}>
            Create
          </Button>
          <Button size="sm" colorScheme="red" onClick={handleDeleteMultiple} leftIcon={<FaTrash />}>
            Delete
          </Button>
        </Flex>
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
          <Button size="sm" colorScheme="green" onClick={handleExportExcel} mr="3" leftIcon={<FaFileExcel />}>
            Export Excel
          </Button>
          <Button size="sm" colorScheme="red" onClick={handleExportPDF} leftIcon={<FaFilePdf />}>
            Export PDF
          </Button>
        </Flex>
      </Flex>
      <Box overflowX="auto"> {/* memastikan tabel dapat digulir secara horizontal */}
        <Table variant="simple" mt="5" size="sm">
          <Thead>
            <Tr>
              <Th>
                <Checkbox 
                  colorScheme='green'
                  isChecked={selectedStudents.length === students.length}
                  onChange={(e) =>
                    setSelectedStudents(e.target.checked ? students.map((student) => student._id) : [])
                  }
                />
              </Th>
              <Th onClick={() => handleSort('no')}>No</Th>
              <Th onClick={() => handleSort('nama')}>Nama</Th>
              <Th onClick={() => handleSort('kelas')}>Kelas</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {currentStudents.map((student, index) => (
              <Tr key={student._id}>
                <Td>
                  <Checkbox
                    colorScheme='red'
                    isChecked={selectedStudents.includes(student._id.toString())}
                    onChange={() => handleSelectStudent(student._id.toString())}
                  />
                </Td>
                <Td>{indexOfFirstStudent + index + 1}</Td>
                <Td>{student.nama}</Td>
                <Td>{student.kelas}</Td>
                <Td>
                  <Button as={Link} to={`/students/${student._id}/edit`} size="sm" colorScheme="blue" mr="2" leftIcon={<FaEdit />}>Edit</Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      <Flex justifyContent="center" mt="4">
        {Array.from({ length: totalPages }, (_, i) => (
          <Button
            key={i + 1}
            onClick={() => handlePageChange(i + 1)}
            colorScheme={currentPage === i + 1 ? 'blue' : 'gray'}
            mx="1"
            size="sm"
          >
            {i + 1}
          </Button>
        ))}
      </Flex>
    </Box>
  );
};

export default Students;