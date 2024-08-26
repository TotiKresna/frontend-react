import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import TestResults from "./pages/TestResults";
import TestResultDetail from "./pages/TestResultDetail";
import StudentDetail from "./pages/StudentDetail";
import EditStudent from "./pages/EditStudent";
import EditTestResult from "./pages/EditTestResult";
import ImportExcel from "./pages/ImportExcel";
import Login from './components/Login';
import Register from './components/Register';
import PrivateRoute from './components/PrivateRoute';
import Layout from "./components/Layout";
import { useAuth } from './contexts/AuthContext';

const AppRoutes = () => {
  const { username, role } = useAuth();

  const AdminRoute = () => {
    if (username && (role === 'admin' || role === 'superadmin')) {
      return <Outlet />;
    }
    return <Navigate to="/dashboard" replace />;
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<PrivateRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/students" element={<Students />} />
          <Route path="/students/:id" element={<StudentDetail />} />
          <Route path="/test-results" element={<TestResults />} />
          <Route path="/test-results/:id" element={<TestResultDetail />} />
          <Route element={<AdminRoute />}>
            <Route path="/students/create" element={<EditStudent />} />
            <Route path="/students/:id/edit" element={<EditStudent />} />
            <Route path="/test-results/create" element={<EditTestResult />} />
            <Route path="/test-results/:id/edit" element={<EditTestResult />} />
            <Route path="/import" element={<ImportExcel />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;