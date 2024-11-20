import React, { useState, useEffect } from "react";
import { 
  Box, 
  Button, 
  VStack, 
  Alert, 
  AlertIcon, 
  AlertTitle, 
  AlertDescription,
  Input,
  FormControl,
  Icon,
  Text,
  useColorModeValue,
  Center,
  InputGroup,
} from "@chakra-ui/react";
import {
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepTitle,
  StepDescription,
  StepSeparator,
  useSteps
} from '@chakra-ui/stepper';
import { useNavigate } from "react-router-dom";
import useToaster from "../components/Toaster";
import Loader from "../components/Loader";
import ExcelFormatHeader from "../components/ExcelFormatHeader";
import { importExcel } from "../api/import";
import { useImportProgress } from '../hooks/ImportProgressHook';
import { FiUploadCloud } from 'react-icons/fi';

const steps = [
  { title: 'First', description: 'Select File' },
  { title: 'Second', description: 'Upload File' },
  { title: 'Third', description: 'Process Data' },
  { title: 'Fourth', description: 'Complete' }
];

const ImportExcel = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToaster();
  const navigate = useNavigate();
  const { status, error, startPolling, stopPolling } = useImportProgress();
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  // Color mode values for styling
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) {
      showToast("Error", "Please select a file.", "error");
      return;
    }

    setLoading(true);
    setActiveStep(1);

    try {
      const response = await importExcel(file);
      showToast("Info", response.data.info, "info");
      setActiveStep(2);
      startPolling();
    } catch (error) {
      console.log(error)
      setActiveStep(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "processing") {
      setActiveStep(3);
      showToast("Tunggu", "File sedang diproses.", "info");
    } 
    else if (status === "failed") {
      stopPolling();
    }
    else if (status === "completed") {
      setActiveStep(4);
      stopPolling();
      showToast("File Berhasil Diproses", "Proses berdasarkan antrian.", "success");
      navigate('/test-results');
    }
  }, [status, stopPolling, navigate, showToast, setActiveStep]);

  if (loading) {
    return <Loader />;
  }

  return (
    <Box p="2" mr="4">
      <VStack spacing={4} align="stretch">
        <ExcelFormatHeader/>
        <form onSubmit={handleSubmit}>
          <FormControl>
            <InputGroup>
              <Center
                w="full"
                h="100px"
                border="2px dashed"
                borderColor={borderColor}
                borderRadius="md"
                px={6}
                py={4}
                cursor="pointer"
                transition="all 0.2s"
                _hover={{ bg: hoverBg }}
                position="relative"
              >
                <Input
                  type="file"
                  height="100%"
                  width="100%"
                  position="absolute"
                  top="0"
                  left="0"
                  opacity="0"
                  aria-hidden="true"
                  accept=".xlsx, .xls"
                  onChange={handleFileChange}
                  cursor="pointer"
                />
                <VStack spacing={2}>
                  <Icon as={FiUploadCloud} boxSize={6} color="blue.500" />
                  <Text fontSize="sm" color="gray.600">
                    {file ? file.name : "Drag and drop your Excel file here or click to browse"}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    Supports .xlsx and .xls files
                  </Text>
                </VStack>
              </Center>
            </InputGroup>
          </FormControl>

          <Button 
            size="sm" 
            type="submit" 
            colorScheme="blue" 
            isDisabled={activeStep > 0}
            mt={4}
            w="20vw"
          >
            Import Excel
          </Button>
        </form>

        <Stepper colorScheme='blue' color='teal.400' index={activeStep}>
          {steps.map((step, index) => (
            <Step key={index}>
              <StepIndicator>
                <StepStatus
                  complete={`🥳`}
                  incomplete={`😅`}
                  active={`📌`}
                />
              </StepIndicator>

              <Box flexShrink='0'>
                <StepTitle>{step.title}</StepTitle>
                <StepDescription>{step.description}</StepDescription>
              </Box>

              <StepSeparator />
            </Step>
          ))}
        </Stepper>

        {activeStep > 1 && (
          <Alert status="info">
            <AlertIcon />
            <AlertTitle mr={2}>Progress :</AlertTitle>
            <AlertDescription>{status}</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert status="error">
            <AlertIcon />
            <AlertTitle mr={2}>Progress :</AlertTitle>
            <AlertDescription>{status}</AlertDescription>
          </Alert>
        )}
      </VStack>
    </Box>
  );
};

export default ImportExcel;