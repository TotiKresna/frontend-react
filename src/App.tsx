import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
// import { Grid, GridItem } from "@chakra-ui/react";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import TestResults from "./pages/TestResults";
import TestResultDetail from "./pages/TestResultDetail";
import StudentDetail from "./pages/StudentDetail";
import EditStudent from "./pages/EditStudent";
import EditTestResult from "./pages/EditTestResult";
import ImportExcel from "./pages/ImportExcel";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Footer from "./components/Footer";
import theme from "./theme";

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Sidebar>
          <Header />
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/students" element={<Students />} />
            <Route path="/students/create" element={<EditStudent />} />
            <Route path="/students/:id/edit" element={<EditStudent />} />
            <Route path="/students/:id" element={<StudentDetail />} />
            <Route path="/test-results" element={<TestResults />} />
            <Route path="/test-results/create" element={<EditTestResult />} />
            <Route path="/test-results/:id/edit" element={<EditTestResult />} />
            <Route path="/test-results/:id" element={<TestResultDetail />} />
            <Route path="/import" element={<ImportExcel />} />
          </Routes>
          <Footer />
        </Sidebar>
      </Router>
    </ChakraProvider>
  );
}

export default App;
