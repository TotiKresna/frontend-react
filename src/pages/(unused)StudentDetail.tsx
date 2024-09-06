import { Box, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchTestResults } from '../api/testResults';
import Loader from '../components/Loader';
import useToaster from '../components/Toaster';

const StudentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [testResults, setTestResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToaster();

  useEffect(() => {
    if (id) {
      fetchTestResults()
        .then((response) => {
          const filteredResults = response.data.filter((result: any) => result.student_id === parseInt(id));
          setTestResults(filteredResults);
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
          showToast('Error', 'Failed to fetch test results', 'error');
        });
    } else {
      showToast('Error', 'Invalid student ID', 'error');
      navigate('/students'); // Redirect to students page if id is not available
    }
  }, [id, navigate, showToast]);

  if (loading) {
    return <Loader />;
  }

  return (
    <Box p="5">
      <Table variant="simple" mt="5">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>OPM Tambah</Th>
            <Th>OPM Kurang</Th>
            <Th>OPM Kali</Th>
            <Th>OPM Bagi</Th>
            <Th>OPM Total</Th>
          </Tr>
        </Thead>
        <Tbody>
          {testResults.map((result) => (
            <Tr key={result.id}>
              <Td>{result.id}</Td>
              <Td>{result.opm_tambah}</Td>
              <Td>{result.opm_kurang}</Td>
              <Td>{result.opm_kali}</Td>
              <Td>{result.opm_bagi}</Td>
              <Td>{result.opm_total}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default StudentDetail;
