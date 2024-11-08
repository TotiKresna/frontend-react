import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import TestResults from "./pages/TestResults";
// import EditStudent from "./pages/EditStudent";
import EditTestResult from "./pages/EditTestResult";
import ImportExcel from "./pages/ImportExcel";
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './components/PrivateRoute';
import Layout from "./components/Layout";
import { ImportProgressProvider } from "./contexts/ImportProgressContext"

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const AppRoutes = () => {

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route 
        path="/api-docs" 
        element={<Navigate to={`${API_URL}/api-docs`} replace />} 
      />
      <Route element={<PrivateRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/students" element={<Students />} />
          {/* <Route path="/students/create" element={<EditStudent />} /> */}
          {/* <Route path="/students/:id/edit" element={<EditStudent />} /> */}
          <Route path="/test-results" element={<TestResults />} />
          <Route path="/test-results/create" element={<EditTestResult />} />
          <Route path="/test-results/:id/edit" element={<EditTestResult />} />
          <Route path="/import" element={
            <ImportProgressProvider>
              <ImportExcel />
            </ImportProgressProvider>
          } />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;