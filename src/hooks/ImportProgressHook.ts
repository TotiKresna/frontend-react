import { useState, useEffect, useCallback } from 'react';
import { getImportProgress } from '../api/import';

export const useImportProgress = () => {
  const [status, setStatus] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  const fetchProgress = useCallback(async () => {
    try {
      const response = await getImportProgress();
      setStatus(response.status);
      if (response.status === "completed") {
        setIsPolling(false);
      }
    } catch (error) {
      setError('Failed to fetch progress');
      setIsPolling(false);
    }
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isPolling) {
      intervalId = setInterval(fetchProgress, 2000); // Poll every 2 seconds
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isPolling, fetchProgress]);

  const startPolling = useCallback(() => {
    setIsPolling(true);
  }, []);

  const stopPolling = useCallback(() => {
    setIsPolling(false);
  }, []);

  return { status, error, startPolling, stopPolling };
};