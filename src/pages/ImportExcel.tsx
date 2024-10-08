// src/pages/ImportExcel.tsx
import React, { useState, useEffect } from "react";
import { Box, Button, Input, VStack, Alert, AlertIcon, AlertTitle, AlertDescription, } from "@chakra-ui/react";
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
import { useImportProgress } from '../hooks/ImportProgressHook';

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
      showToast("Info", response.data.info, "info");
      setActiveStep(2); // Upload successful
      startPolling();
      // navigate("/test-results");
    } catch (error) {
      console.log(error)
      setActiveStep(0);
      // showToast("Error", "Failed to import file.", "error");
    } finally {
      setLoading(false); // Set loading to false after the upload is done
    }
  };

  useEffect(() => {
  if (status === "processing") {
    setActiveStep(3); // Processing
    showToast("Tunggu", "File sedang diproses.", "info");
  } 
    else if (status === "failed"){
    stopPolling();
    // showToast("Error", "File gagal diproses.", "error");
  }
    else if (status === "completed") {
    setActiveStep(4); // Complete
    stopPolling();
    showToast("File Berhasil Diproses", "Proses berdasarkan antrian.", "success");
    navigate('/test-results');
  }
}, [status, stopPolling, navigate, showToast, setActiveStep]);

  if (loading) {
    return <Loader />;
  }


  return (
    <Box p="5">
      <VStack spacing={4} align="stretch">
        <form onSubmit={handleSubmit}>
          <Input type="file" accept=".xlsx, .xls" onChange={handleFileChange} mb="3" />
          <Button size="sm" type="submit" colorScheme="blue" isDisabled={activeStep > 0}>
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
