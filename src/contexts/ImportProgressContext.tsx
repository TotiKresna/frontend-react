import React, { createContext, useState, useContext, ReactNode } from 'react';

interface ImportProgressContextType {
  progress: number;
  setProgress: (progress: number) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

const ImportProgressContext = createContext<ImportProgressContextType | undefined>(undefined);

export const ImportProgressProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  return (
    <ImportProgressContext.Provider value={{ progress, setProgress, error, setError }}>
      {children}
    </ImportProgressContext.Provider>
  );
};

export const useImportProgressContext = () => {
  const context = useContext(ImportProgressContext);
  if (context === undefined) {
    throw new Error('useImportProgressContext must be used within an ImportProgressProvider');
  }
  return context;
};