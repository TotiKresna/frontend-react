import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  username: string | null;
  role: string | null;
  login: (username: string, role: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedRole = localStorage.getItem('role');
    if (storedUsername && storedRole) {
      setUsername(storedUsername);
      setRole(storedRole);
    }
  }, []);

  const login = (newUsername: string, newRole: string) => {
    setUsername(newUsername);
    setRole(newRole);
    localStorage.setItem('username', newUsername);
    localStorage.setItem('role', newRole);
  };

  const logout = () => {
    setUsername(null);
    setRole(null);
    localStorage.removeItem('username');
    localStorage.removeItem('role');
  };

  return (
    <AuthContext.Provider value={{ username, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};