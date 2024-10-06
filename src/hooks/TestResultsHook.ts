import { useState, useEffect } from 'react';
import { fetchTestResults, deleteMultipleTestResults } from "../api/testResults";
import useToaster from "../components/Toaster";
import { WarningAlert, DeleteConfirmationAlert } from '../components/SweetAlert';

export const useTestResults = () => {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [selectedResults, setSelectedResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: "ascending" | "descending" } | null>(null);
  const { showToast } = useToaster();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
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
  };

  const handleSelectResult = (id: string) => {
    setSelectedResults((prev) =>
      prev.includes(id) ? prev.filter((rid) => rid !== id) : [...prev, id]
    );
  };

  const handleDeleteMultiple = () => {
    if (selectedResults.length === 0) {
      WarningAlert({ text: 'Anda belum memilih data' });
    } else {
      DeleteConfirmationAlert({
        onConfirm: () => {
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
        },
        itemName: `${selectedResults.length} student${selectedResults.length > 1 ? 's' : ''}`
      });
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSort = (key: string) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedAndFilteredResults = [...testResults]
    .sort((a, b) => {
      if (sortConfig !== null) {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
      }
      return 0;
    })
    .filter((result) =>
      result.student_id.nama.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return {
    testResults: sortedAndFilteredResults,
    selectedResults,
    loading,
    searchTerm,
    handleSelectResult,
    handleDeleteMultiple,
    handleSearch,
    handleSort,
    fetchData,
  };
};