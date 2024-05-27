import {
    Box,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
  } from "@chakra-ui/react";
  import { useEffect, useState } from "react";
  import { useParams } from "react-router-dom";
  import { fetchTestResults } from "../api/testResults";
  import Loader from "../components/Loader";
  import useToaster from "../components/Toaster";
  
  const TestResultDetail = () => {
    const { studentId } = useParams();
    const [testResults, setTestResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToaster();
  
    useEffect(() => {
      fetchTestResults()
        .then((response) => {
          const studentResults = response.data.filter((result: any) => result.student_id._id === studentId);
          setTestResults(studentResults);
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
          showToast("Error", "Failed to fetch test results", "error");
        });
    }, [studentId]);
  
    if (loading) {
      return <Loader />;
    }
  
    return (
      <Box p="5">
        <Box as="h2" fontSize="xl" mb="5">
          Riwayat Test
        </Box>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Nomor</Th>
              <Th>Nama</Th>
              <Th>Kelas</Th>
              <Th>OPM Tambah</Th>
              <Th>OPM Kurang</Th>
              <Th>OPM Kali</Th>
              <Th>OPM Bagi</Th>
            </Tr>
          </Thead>
          <Tbody>
            {testResults.map((result, index) => (
              <Tr key={result._id}>
                <Td>{index + 1}</Td>
                <Td>{result.student_id.nama}</Td>
                <Td>{result.student_id.kelas}</Td>
                <Td>{result.opm_tambah}</Td>
                <Td>{result.opm_kurang}</Td>
                <Td>{result.opm_kali}</Td>
                <Td>{result.opm_bagi}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    );
  };
  
  export default TestResultDetail;
  