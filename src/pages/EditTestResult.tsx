import { Box, Button, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchTestResults, createTestResult, updateTestResult } from '../api/testResults';
import useToaster from '../components/Toaster';
import Loader from '../components/Loader';

const EditTestResult = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [testResult, setTestResult] = useState({
    nama: '',
    kelas: '',
    opm_tambah: '',
    opm_kurang: '',
    opm_kali: '',
    opm_bagi: ''
  });
  const [loading, setLoading] = useState(true);
  const { showToast } = useToaster();

  useEffect(() => {
    if (id) {
      fetchTestResults()
        .then((response) => {
          const foundResult = response.data.find((result: any) => result._id === id);
          if (foundResult) {
            setTestResult({
              nama: foundResult.student_id.nama,
              kelas: foundResult.student_id.kelas,
              opm_tambah: foundResult.opm_tambah,
              opm_kurang: foundResult.opm_kurang,
              opm_kali: foundResult.opm_kali,
              opm_bagi: foundResult.opm_bagi
            });
          }
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
    const dataToSend = {
      nama: testResult.nama,
      kelas: testResult.kelas,
      opm_tambah: parseFloat(testResult.opm_tambah),
      opm_kurang: parseFloat(testResult.opm_kurang),
      opm_kali: parseFloat(testResult.opm_kali),
      opm_bagi: parseFloat(testResult.opm_bagi)
    };
    if (id) {
      updateTestResult(id, dataToSend)
        .then(() => {
          showToast('Success', 'Test result updated successfully', 'success');
          navigate('/test-results');
        })
        .catch((error) => {
          console.error(error);
          showToast('Error', 'Failed to update test result', 'error');
        });
    } else {
      createTestResult(dataToSend)
        .then(() => {
          showToast('Success', 'Test result created successfully', 'success');
          navigate('/test-results');
        })
        .catch((error) => {
          console.error(error);
          showToast('Error', 'Failed to create test result', 'error');
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
          <FormLabel>Nama Siswa</FormLabel>
          <Input
            type="text"
            value={testResult.nama}
            onChange={(e) => setTestResult({ ...testResult, nama: e.target.value })}
            disabled={!!id}  // Disable if id exists (edit mode)
          />
        </FormControl>
        <FormControl isRequired mt="3">
          <FormLabel>Kelas</FormLabel>
          <Input
            type="text"
            value={testResult.kelas}
            onChange={(e) => setTestResult({ ...testResult, kelas: e.target.value })}
            disabled={!!id}  // Disable if id exists (edit mode)
          />
        </FormControl>
        <FormControl isRequired mt="3">
          <FormLabel>OPM Tambah</FormLabel>
          <Input
            type="number"
            value={testResult.opm_tambah}
            onChange={(e) => setTestResult({ ...testResult, opm_tambah: e.target.value })}
          />
        </FormControl>
        <FormControl isRequired mt="3">
          <FormLabel>OPM Kurang</FormLabel>
          <Input
            type="number"
            value={testResult.opm_kurang}
            onChange={(e) => setTestResult({ ...testResult, opm_kurang: e.target.value })}
          />
        </FormControl>
        <FormControl isRequired mt="3">
          <FormLabel>OPM Kali</FormLabel>
          <Input
            type="number"
            value={testResult.opm_kali}
            onChange={(e) => setTestResult({ ...testResult, opm_kali: e.target.value })}
          />
        </FormControl>
        <FormControl isRequired mt="3">
          <FormLabel>OPM Bagi</FormLabel>
          <Input
            type="number"
            value={testResult.opm_bagi}
            onChange={(e) => setTestResult({ ...testResult, opm_bagi: e.target.value })}
          />
        </FormControl>
        <Button type="submit" mt="5" colorScheme="blue">
          {id ? 'Update' : 'Create'}
        </Button>
      </form>
    </Box>
  );
};

export default EditTestResult;
