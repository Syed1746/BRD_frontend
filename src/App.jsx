// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import EmployeePage from "./pages/Employee"; // ✅ Import Employee Page
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Attendance from "./pages/Attendance";
import Customer from "./pages/Customer";
import Vendor from "./pages/Vendor";
import Projects from "./pages/Projects";
import Invoice from "./pages/Invoice";
import Timesheet from "./pages/Timesheet";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/employees" element={<EmployeePage />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/customers" element={<Customer />} />
          <Route path="/vendors" element={<Vendor />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/invoices" element={<Invoice />} />
          <Route path="/timesheets" element={<Timesheet />} />
        </Route>
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
