import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Container,
  SimpleGrid,
  useColorModeValue,
  Text
} from '@chakra-ui/react';
import { fetchTestResults, createTestResult, updateTestResult } from '../api/testResults';
import useToaster from '../components/Toaster';
import Loader from '../components/Loader';

const EditTestResult: React.FC = () => {
  const { id } = useParams<{ id: string }>();
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

  const bgColor = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const bgInput = useColorModeValue('white', 'gray.800');

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
    <Container maxW="container.md" py={8}>
      <Box bg={bgColor} p={6} borderRadius="lg" boxShadow="md" borderWidth={1} borderColor={borderColor}>
        <Heading as="h1" size="lg" mb={6} textAlign="center">
          {id ? '🛠️ Update Nilai Test' : '✏️ Input Nilai Test'}
        </Heading>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <FormControl isRequired>
                <FormLabel>Nama</FormLabel>
                <Input
                  placeholder="Nama Siswa"
                  type="text"
                  value={testResult.nama}
                  onChange={(e) => setTestResult({ ...testResult, nama: e.target.value })}
                  disabled={!!id}
                  bg={bgInput}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Kelas</FormLabel>
                <Input
                  placeholder="Kelas"
                  type="text"
                  value={testResult.kelas}
                  onChange={(e) => setTestResult({ ...testResult, kelas: e.target.value })}
                  disabled={!!id}
                  bg={bgInput}
                />
              </FormControl>
            </SimpleGrid>
            <Text fontWeight="bold" mt={4}>Nilai Test (OPM)</Text>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <FormControl>
                <FormLabel>Operasi Tambah</FormLabel>
                <Input
                  placeholder="Operasi Tambah"
                  type="number"
                  value={testResult.opm_tambah}
                  onChange={(e) => setTestResult({ ...testResult, opm_tambah: e.target.value })}
                  bg={bgInput}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Operasi Kurang</FormLabel>
                <Input
                  placeholder="Operasi Kurang"
                  type="number"
                  value={testResult.opm_kurang}
                  onChange={(e) => setTestResult({ ...testResult, opm_kurang: e.target.value })}
                  bg={bgInput}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Operasi Kali</FormLabel>
                <Input
                  placeholder="Operasi Kali"
                  type="number"
                  value={testResult.opm_kali}
                  onChange={(e) => setTestResult({ ...testResult, opm_kali: e.target.value })}
                  bg={bgInput}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Operasi Bagi</FormLabel>
                <Input
                  placeholder="Operasi Bagi"
                  type="number"
                  value={testResult.opm_bagi}
                  onChange={(e) => setTestResult({ ...testResult, opm_bagi: e.target.value })}
                  bg={bgInput}
                />
              </FormControl>
            </SimpleGrid>
            <Box mt={6} display="flex" justifyContent="space-between">
              <Button as={Link} to="/test-results" colorScheme="gray">
                Back
              </Button>
              <Button type="submit" colorScheme="blue">
                {id ? 'Update' : 'Create'}
              </Button>
            </Box>
          </VStack>
        </form>
      </Box>
    </Container>
  );
};

export default EditTestResult;