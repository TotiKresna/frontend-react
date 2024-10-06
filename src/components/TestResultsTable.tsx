import React from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Checkbox, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { FaEdit } from "react-icons/fa";

interface TestResultsTableProps {
  results: any[];
  selectedResults: string[];
  isSuperAdminOrAdmin: boolean;
  onSelectResult: (id: string) => void;
  onSelectAll: (checked: boolean) => void;
  onSort: (key: string) => void;
  startIndex: number;
}

export const TestResultsTable: React.FC<TestResultsTableProps> = ({
  results,
  selectedResults,
  isSuperAdminOrAdmin,
  onSelectResult,
  onSelectAll,
  onSort,
  startIndex,
}) => {
  const TableHeader: React.FC = () => (
    <Tr>
      {isSuperAdminOrAdmin && (
        <Th>
          <Checkbox
            colorScheme='green'
            isChecked={selectedResults.length === results.length}
            onChange={(e) => onSelectAll(e.target.checked)}
          />
        </Th>
      )}
      <Th onClick={() => onSort("no")}>No</Th>
      <Th onClick={() => onSort("nama")}>Nama Siswa</Th>
      <Th onClick={() => onSort("kelas")}>Kelas</Th>
      <Th onClick={() => onSort("opm_tambah")}>OPM Tambah</Th>
      <Th onClick={() => onSort("opm_kurang")}>OPM Kurang</Th>
      <Th onClick={() => onSort("opm_kali")}>OPM Kali</Th>
      <Th onClick={() => onSort("opm_bagi")}>OPM Bagi</Th>
      <Th onClick={() => onSort("opm_total")}>OPM Total</Th>
      {isSuperAdminOrAdmin && (<Th>Actions</Th>)}
    </Tr>
  );

  const TableRow: React.FC<{ result: any; index: number }> = ({ result, index }) => (
    <Tr>
      {isSuperAdminOrAdmin && (
        <Td>
          <Checkbox
            colorScheme='red'
            isChecked={selectedResults.includes(result._id)}
            onChange={() => onSelectResult(result._id)}
          />
        </Td>
      )}
      <Td>{startIndex + index + 1}</Td>
      <Td>{result.student_id.nama}</Td>
      <Td>{result.student_id.kelas}</Td>
      <Td>{result.opm_tambah}</Td>
      <Td>{result.opm_kurang}</Td>
      <Td>{result.opm_kali}</Td>
      <Td>{result.opm_bagi}</Td>
      <Td>{result.opm_total}</Td>
      {isSuperAdminOrAdmin && (
        <Td>
          <Button
            as={Link}
            to={`/test-results/${result._id}/edit`}
            size="sm"
            colorScheme="blue"
            mr="2"
            leftIcon={<FaEdit />}
          >
            Edit
          </Button>
        </Td>
      )}
    </Tr>
  );

  return (
    <Table variant="simple" size="sm">
      <Thead>
        <TableHeader />
      </Thead>
      <Tbody>
        {results.map((result, index) => (
          <TableRow key={result._id} result={result} index={index} />
        ))}
      </Tbody>
    </Table>
  );
};