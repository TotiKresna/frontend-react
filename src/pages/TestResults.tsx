import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Checkbox,
  Flex,
  Heading,
  Input,
  Spacer,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchTestResults, deleteMultipleTestResults } from "../api/testResults";
import Loader from "../components/Loader";
import useToaster from "../components/Toaster";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { FaPlus, FaTrash, FaFileExcel, FaFilePdf, FaEdit, FaSync } from "react-icons/fa";
import { WarningAlert, DeleteConfirmationAlert } from '../components/SweetAlert';

const TestResults = () => {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [selectedResults, setSelectedResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: "ascending" | "descending" } | null>(null);
  const { showToast } = useToaster();
  const [userRole, setUserRole] = useState('');

  const isSuperAdminOrAdmin = (userRole === 'superadmin' || userRole === 'admin');

  useEffect(() => {
    fetchTestResults()
      .then((response) => {
        const uniqueResults = response.data.reduce((acc: any[], current: any) => {
          const x = acc.find(item => item.student_id._id === current.student_id._id);
          if (!x) {
            return acc.concat([current]);
          } else {
            return acc;
          }
        }, []);
        setTestResults(uniqueResults);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
      const storedUserRole = localStorage.getItem('role');
      if (storedUserRole) setUserRole(storedUserRole);
  }, []);

  const handleSelectResult = (id: string) => {
    setSelectedResults((prev) =>
      prev.includes(id) ? prev.filter((rid) => rid !== id) : [...prev, id]
    );
  };

  const handleDeleteMultiple = () => {
    if (selectedResults.length === 0) {
      WarningAlert({ text: 'Anda belum memilih data' });
    } else {
      DeleteConfirmationAlert({
        onConfirm: () => {
          deleteMultipleTestResults(selectedResults)
            .then(() => {
              setTestResults((prev) =>
                prev.filter((result) => !selectedResults.includes(result._id))
              );
              setSelectedResults([]);
              showToast(
                "Success",
                "Selected test results deleted successfully",
                "success"
              );
            })
            .catch((error) => {
              console.error(error);
              showToast("Error", "Failed to delete selected test results", "error");
            });
        },
        itemName: `${selectedResults.length} student${selectedResults.length > 1 ? 's' : ''}`
      });
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [["No", "Nama Siswa", "Kelas", "OPM Tambah", "OPM Kurang", "OPM Kali", "OPM Bagi", "OPM Total"]],
      body: testResults.map((result, index) => [
        index + 1,
        result.student_id.nama,
        result.student_id.kelas,
        result.opm_tambah,
        result.opm_kurang,
        result.opm_kali,
        result.opm_bagi,
        result.opm_total,
      ]),
    });
    doc.save("test_results.pdf");
  };

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      testResults.map((result, index) => ({
        No: index + 1,
        Nama: result.student_id.nama,
        Kelas: result.student_id.kelas,
        OPM_Tambah: result.opm_tambah,
        OPM_Kurang: result.opm_kurang,
        OPM_Kali: result.opm_kali,
        OPM_Bagi: result.opm_bagi,
        OPM_Total: result.opm_total,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "TestResults");
    XLSX.writeFile(workbook, "test_results.xlsx");
  };

  const handleSort = (key: string) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchTestResults()
      .then((response) => {
        const uniqueResults = response.data.reduce((acc: any[], current: any) => {
          const x = acc.find(item => item.student_id._id === current.student_id._id);
          if (!x) {
            return acc.concat([current]);
          } else {
            return acc;
          }
        }, []);
        setTestResults(uniqueResults);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  const sortedResults = [...testResults].sort((a, b) => {
    if (sortConfig !== null) {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
    }
    return 0;
  });

  const filteredResults = sortedResults.filter((result) =>
    result.student_id.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = filteredResults.slice(indexOfFirstResult, indexOfLastResult);

  const totalPages = Math.ceil(filteredResults.length / resultsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Box p={{ base: "4", md: "5", lg: "6" }}>
      <Flex mb="4"  alignItems="center">
        <Heading size="lg">Data Nilai</Heading>
          <Button ml="3" borderRadius="10" size="xs" colorScheme="teal" onClick={handleRefresh} >
          <FaSync />
          </Button>
          <Spacer />
        {isSuperAdminOrAdmin && (
        <Flex>
          <Button size="sm" colorScheme="blue" as={Link} to="/test-results/create" mr="3" leftIcon={<FaPlus />}>
            Create
          </Button>
          <Button size="sm" colorScheme="red" onClick={handleDeleteMultiple} leftIcon={<FaTrash />}>
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
          <Button size="sm" colorScheme="green" onClick={handleExportExcel} mr="3" leftIcon={<FaFileExcel />}>
            Export Excel
          </Button>
          <Button size="sm" colorScheme="red" onClick={handleExportPDF} leftIcon={<FaFilePdf />}>
            Export PDF
          </Button>
        </Flex>
      </Flex>
      <Box overflowX="auto">
        <Table variant="simple" mt="5" size="sm">
          <Thead>
            <Tr>
            {isSuperAdminOrAdmin && (
              <Th>
                <Checkbox
                  colorScheme='green'
                  isChecked={selectedResults.length === testResults.length}
                  onChange={(e) =>
                    setSelectedResults(
                      e.target.checked ? testResults.map((result) => result._id) : []
                    )
                  }
                />
              </Th>
            )}
              <Th onClick={() => handleSort("no")}>No</Th>
              <Th onClick={() => handleSort("nama")}>Nama Siswa</Th>
              <Th onClick={() => handleSort("kelas")}>Kelas</Th>
              <Th onClick={() => handleSort("opm_tambah")}>OPM Tambah</Th>
              <Th onClick={() => handleSort("opm_kurang")}>OPM Kurang</Th>
              <Th onClick={() => handleSort("opm_kali")}>OPM Kali</Th>
              <Th onClick={() => handleSort("opm_bagi")}>OPM Bagi</Th>
              <Th onClick={() => handleSort("opm_total")}>OPM Total</Th>
              {isSuperAdminOrAdmin && (<Th>Actions</Th>)}
            </Tr>
          </Thead>
          <Tbody>
            {currentResults.map((result, index) => (
              <Tr key={result._id}>
                {isSuperAdminOrAdmin && (
                <Td>
                  <Checkbox
                    colorScheme='red'
                    isChecked={selectedResults.includes(result._id)}
                    onChange={() => handleSelectResult(result._id)}
                  />
                </Td>
                )}
                <Td>{indexOfFirstResult + index + 1}</Td>
                <Td>
                  {/* <a
                    href={`/test-results/${result.student_id._id}/details`}
                    target="_blank"
                    rel="noopener noreferrer"
                  > */}
                    {result.student_id.nama}
                  {/* </a> */}
                </Td>
                <Td>{result.student_id.kelas}</Td>
                <Td>{result.opm_tambah}</Td>
                <Td>{result.opm_kurang}</Td>
                <Td>{result.opm_kali}</Td>
                <Td>{result.opm_bagi}</Td>
                <Td>{result.opm_total}</Td>
                {isSuperAdminOrAdmin && (
                <Td>
                  <Button
                    as={Link}
                    to={`/test-results/${result._id}/edit`}
                    size="sm"
                    colorScheme="blue"
                    mr="2"
                    leftIcon={<FaEdit />}
                  >
                    Edit
                  </Button>
                </Td>
                )}
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
            colorScheme={currentPage === i + 1 ? "blue" : "gray"}
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

export default TestResults;