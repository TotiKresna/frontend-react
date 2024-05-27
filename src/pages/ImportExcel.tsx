// src/pages/ImportExcel.tsx
import React, { useState } from "react";
import { Box, Button, Input } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import useToaster from "../components/Toaster";
import Loader from "../components/Loader";
import { importExcel } from "../api/import";

const ImportExcel = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToaster();
  const navigate = useNavigate();

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

    try {
      const response = await importExcel(file);
      showToast("Success", response.data.success, "success");
      navigate("/test-results");
    } catch (error) {
      console.log(error)
      showToast("Error", "Failed to import file.", "error");
    } finally {
      setLoading(false); // Set loading to false after the upload is done
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Box p="5">
      <form onSubmit={handleSubmit}>
        <Input type="file" accept=".xlsx, .xls" onChange={handleFileChange} mb="3" />
        <Button type="submit" colorScheme="blue">
          Import Excel
        </Button>
      </form>
    </Box>
  );
};

export default ImportExcel;
