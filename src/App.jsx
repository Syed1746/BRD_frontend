// src/App.jsx
import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import EmployeePage from "./pages/Employee";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Attendance from "./pages/Attendance";
import Customer from "./pages/Customer";
import Vendor from "./pages/Vendor";
import Projects from "./pages/Projects";
import Invoice from "./pages/Invoice";
import Timesheet from "./pages/Timesheet";
import EmployeeForm from "./pages/EmployeeForm";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  // Reactive state for role and token
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Handle login: set localStorage and update state
  const handleLogin = (userRole, userToken) => {
    localStorage.setItem("role", userRole);
    localStorage.setItem("token", userToken);
    setRole(userRole);
    setToken(userToken);
  };

  // Handle logout: clear localStorage and reset state
  const handleLogout = () => {
    localStorage.clear();
    setRole(null);
    setToken(null);
    window.location.href = "/";
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<SignIn onLogin={handleLogin} />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Admin/Manager Dashboard */}
        {["Admin", "Manager"].includes(role) && (
          <Route element={<ProtectedRoute roles={["Admin", "Manager"]} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/employees" element={<EmployeePage />} />
              <Route path="/employees/add" element={<EmployeeForm />} />
              <Route path="/employees/edit/:id" element={<EmployeeForm />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/customers" element={<Customer />} />
              <Route path="/vendors" element={<Vendor />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/invoices" element={<Invoice />} />
              <Route path="/timesheets" element={<Timesheet />} />
            </Route>
          </Route>
        )}

        {/* Employee Dashboard */}
        {role === "Employee" && (
          <Route element={<ProtectedRoute roles={["Employee"]} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<EmployeeDashboard />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/timesheets" element={<Timesheet />} />
            </Route>
          </Route>
        )}

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
