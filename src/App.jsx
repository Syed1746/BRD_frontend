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

function App() {
  const role = localStorage.getItem("role"); // read dynamically

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth routes */}
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Dashboard for Admin/Manager */}
        {["Admin", "Manager"].includes(role) && (
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
        )}

        {/* Dashboard for Employee */}
        {role === "Employee" && (
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<EmployeeDashboard />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/timesheets" element={<Timesheet />} />
          </Route>
        )}

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
