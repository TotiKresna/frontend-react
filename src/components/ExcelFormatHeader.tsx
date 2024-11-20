import React from "react";
import {
  Box,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";

const ExcelFormatHeader: React.FC = () => {
  // Warna yang disesuaikan dengan color mode
  const tableHeaderBg = useColorModeValue("gray.100", "gray.700");
  const boxBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("black", "white");

  return (
    <Box p={4} borderWidth={1} borderRadius="lg" shadow="md" bg={boxBg}>
      <VStack spacing={4} align="start">
        <Text fontWeight="bold" fontSize="lg" color={textColor}>
          Format Excel yang Harus Diunggah
        </Text>
        <Text color={textColor}>
          Pastikan file Excel Anda memiliki format kolom sebagai berikut:
        </Text>
        {/* Tambahkan horizontal scroll untuk tabel */}
        <Box overflowX="auto" w="100%">
          <Table variant="simple" size="sm">
            <Thead bg={tableHeaderBg}>
              <Tr>
                <Th>Nama</Th>
                <Th>Kelas</Th>
                <Th>OPM Tambah</Th>
                <Th>OPM Kurang</Th>
                <Th>OPM Kali</Th>
                <Th>OPM Bagi</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>Nama</Td>
                <Td>Kelas</Td>
                <Td></Td>
                <Td>56.78</Td>
                <Td>12,34</Td>
                <Td>56.78</Td>
              </Tr>
            </Tbody>
          </Table>
        </Box>
      </VStack>
    </Box>
  );
};

export default ExcelFormatHeader;
