// src/pages/ImportExcel.tsx
import React, { useState, useEffect } from "react";
import { Box, Button, Input, VStack, Text } from "@chakra-ui/react";
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
import { importExcel } from "../api/import";
import { useImportProgress } from '../hooks/ImportProgress';

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

    setLoading(true); // Set loading to true when starting the upload
    setActiveStep(1); // File selected

    try {
      const response = await importExcel(file);
      showToast("Success", response.data.success, "success");
      setActiveStep(2); // Upload successful
      startPolling();
      // navigate("/test-results");
    } catch (error) {
      console.log(error)
      setActiveStep(0);
      showToast("Error", "Failed to import file.", "error");
    } finally {
      setLoading(false); // Set loading to false after the upload is done
    }
  };

  // if (loading) {
  //   return <Loader />;
  // }

    useEffect(() => {
    if (status === "completed") {
      setActiveStep(4); // Complete
      stopPolling();
      showToast("Success", "File imported successfully.", "success");
      navigate('/test-results');
    } else if (status === "processing") {
      showToast("Info", "File processing.", "info");
      setActiveStep(3); // Processing
    }
  }, [status, stopPolling, navigate, showToast, setActiveStep]);

  return (
    <Box p="5">
      <VStack spacing={4} align="stretch">
        <form onSubmit={handleSubmit}>
          <Input type="file" accept=".xlsx, .xls" onChange={handleFileChange} mb="3" />
          <Button type="submit" colorScheme="blue" isDisabled={activeStep > 0}>
            Import Excel
          </Button>
        </form>

        <Stepper index={activeStep}>
          {steps.map((step, index) => (
            <Step key={index}>
              <StepIndicator>
                <StepStatus
                  complete={<StepIndicator />}
                  incomplete={<StepIndicator />}
                  active={<StepIndicator />}
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
          <Text>Progress: {status}</Text>
        )}

        {error && (
          <Text color="red.500">{error}</Text>
        )}
      </VStack>
    </Box>
  );
};

export default ImportExcel;
