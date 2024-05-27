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
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  fetchTestResults,
  deleteMultipleTestResults,
} from "../api/testResults";
import Loader from "../components/Loader";
import useToaster from "../components/Toaster";

const TestResults = () => {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [selectedResults, setSelectedResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToaster();
  const navigate = useNavigate();

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
  }, []);

  const handleSelectResult = (id: string) => {
    setSelectedResults((prev) =>
      prev.includes(id) ? prev.filter((rid) => rid !== id) : [...prev, id]
    );
  };

  const handleDeleteMultiple = () => {
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
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Box p="5">
      <Button as={Link} to="/test-results/create">
        Create Test Result
      </Button>
      <Button colorScheme="red" ml="3" onClick={handleDeleteMultiple}>
        Delete Selected
      </Button>
      <Button as={Link} to="/test-results/import" ml="3">
        Import Excel
      </Button>
      <Table variant="simple" mt="5">
        <Thead>
          <Tr>
            <Th>
              <Checkbox
                isChecked={selectedResults.length === testResults.length}
                onChange={(e) =>
                  setSelectedResults(
                    e.target.checked
                      ? testResults.map((result) => result._id)
                      : []
                  )
                }
              />
            </Th>
            <Th>ID</Th>
            <Th>Nama Siswa</Th>
            <Th>Kelas</Th>
            <Th>OPM Tambah</Th>
            <Th>OPM Kurang</Th>
            <Th>OPM Kali</Th>
            <Th>OPM Bagi</Th>
            <Th>OPM Total</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {testResults.map((result) => (
            <Tr key={result._id}>
              <Td>
                <Checkbox
                  isChecked={selectedResults.includes(result._id)}
                  onChange={() => handleSelectResult(result._id)}
                />
              </Td>
              <Td>{result._id}</Td>
              <Td>
                <a
                  href={`/test-results/${result.student_id._id}/details`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {result.student_id.nama}
                </a>
              </Td>
              <Td>{result.student_id.kelas}</Td>
              <Td>{result.opm_tambah}</Td>
              <Td>{result.opm_kurang}</Td>
              <Td>{result.opm_kali}</Td>
              <Td>{result.opm_bagi}</Td>
              <Td>{result.opm_total}</Td>
              <Td>
                <Button
                  as={Link}
                  to={`/test-results/${result._id}/edit`}
                  size="sm"
                  colorScheme="blue"
                  mr="2"
                >
                  Edit
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default TestResults;
