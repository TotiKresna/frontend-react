import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import TestResults from "./pages/TestResults";
// import TestResultDetail from "./pages/(unused)TestResultDetail";
// import StudentDetail from "./pages/(unused)StudentDetail";
import EditStudent from "./pages/EditStudent";
import EditTestResult from "./pages/EditTestResult";
import ImportExcel from "./pages/ImportExcel";
import Login from './components/Login';
import Register from './components/Register';
import PrivateRoute from './components/PrivateRoute';
import Layout from "./components/Layout";
import { ImportProgressProvider } from "./contexts/ImportProgressContext"

const AppRoutes = () => {

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<PrivateRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/students" element={<Students />} />
          <Route path="/students/create" element={<EditStudent />} />
          <Route path="/students/:id/edit" element={<EditStudent />} />
          {/* <Route path="/students/:id" element={<StudentDetail />} /> */}
          <Route path="/test-results" element={<TestResults />} />
          <Route path="/test-results/create" element={<EditTestResult />} />
          <Route path="/test-results/:id/edit" element={<EditTestResult />} />
          {/* <Route path="/test-results/:id" element={<TestResultDetail />} /> */}
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