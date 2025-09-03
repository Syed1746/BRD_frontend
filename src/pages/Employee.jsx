import React, { useEffect, useState } from "react";
import axios from "axios";
import { Dialog } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Trash2, Eye, Download, X } from "lucide-react";
import { BASE_URL } from "../../config";

export default function EmployeePage() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [formData, setFormData] = useState({
    employee_code: "",
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    department: "",
    designation: "",
    experience: "",
    active: "Active",
  });
  const [editId, setEditId] = useState(null);
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  // Fetch Employees
  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${BASE_URL}/api/employees`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(res.data || []);
    } catch (err) {
      console.error(
        "Failed to fetch employees:",
        err.response?.data || err.message
      );
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Handle Add/Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (editId) {
        await axios.put(`${BASE_URL}/api/employees/${editId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`${BASE_URL}/api/employees`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      fetchEmployees();
      setIsOpen(false);
      resetForm();
    } catch (err) {
      console.error(
        "Error saving employee:",
        err.response?.data || err.message
      );
    }
  };

  const resetForm = () => {
    setFormData({
      employee_code: "",
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      department: "",
      designation: "",
      experience: "",
      active: "Active",
    });
    setEditId(null);
  };

  const handleEdit = (emp) => {
    setFormData({
      employee_code: emp.employee_code,
      first_name: emp.first_name,
      last_name: emp.last_name,
      email: emp.email,
      phone_number: emp.phone_number,
      department: emp.department,
      designation: emp.designation,
      experience: emp.experience,
      active: emp.active || "Active",
    });
    setEditId(emp._id);
    setIsOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?"))
      return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${BASE_URL}/api/employees/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchEmployees();
    } catch (err) {
      console.error("Failed to delete:", err.response?.data || err.message);
    }
  };

  const handleView = (emp) => {
    setSelectedEmployee(emp);
    setViewOpen(true);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      "Employee Code",
      "First Name",
      "Last Name",
      "Email",
      "Phone",
      "Department",
      "Designation",
      "Experience",
      "Status",
    ];
    const csvRows = [
      headers.join(","),
      ...employees.map((e) =>
        [
          e.employee_code,
          e.first_name,
          e.last_name,
          e.email,
          e.phone_number,
          e.department,
          e.designation,
          e.experience,
          e.active,
        ].join(",")
      ),
    ];
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "employees.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Pagination
  const filteredEmployees = employees.filter((e) =>
    `${e.first_name} ${e.last_name}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredEmployees.length / rowsPerPage);
  const currentEmployees = filteredEmployees.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 bg-gradient-to-r from-gray-50 via-white to-gray-100 min-h-screen"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-xl p-6"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h2 className="flex items-center gap-3 text-3xl font-bold text-gray-800 tracking-tight">
            <span className="p-2 bg-blue-100 text-blue-600 rounded-xl shadow">
              👨‍💼
            </span>
            Employee Management
          </h2>

          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExportCSV}
              className="flex items-center gap-2 bg-gradient-to-r from-gray-200 to-gray-300 px-4 py-2 rounded-lg shadow hover:from-gray-300 hover:to-gray-400"
            >
              <Download size={16} /> Export CSV
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(true)}
              className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-4 py-2 rounded-lg shadow hover:from-blue-600 hover:to-blue-800"
            >
              + Add Employee
            </motion.button>
          </div>
        </div>

        {/* Search */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Search by name..."
            className="border p-2 w-full rounded-lg focus:ring-2 focus:ring-blue-400 outline-none shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border rounded-lg shadow-md">
            <thead className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700">
              <tr>
                {[
                  "Code",
                  "Name",
                  "Email",
                  "Phone",
                  "Department",
                  "Designation",
                  "Experience",
                  "Status",
                  "Actions",
                ].map((head) => (
                  <th key={head} className="p-3 border text-left font-semibold">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {currentEmployees.map((emp) => (
                  <motion.tr
                    key={emp._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="hover:bg-gray-50 transition border-b"
                  >
                    <td className="p-3">{emp.employee_code}</td>
                    <td className="p-3">
                      {emp.first_name} {emp.last_name}
                    </td>
                    <td className="p-3">{emp.email}</td>
                    <td className="p-3">{emp.phone_number}</td>
                    <td className="p-3">{emp.department}</td>
                    <td className="p-3">{emp.designation}</td>
                    <td className="p-3">{emp.experience}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          emp.active === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {emp.active}
                      </span>
                    </td>
                    <td className="p-3 flex gap-3">
                      <button
                        onClick={() => handleEdit(emp)}
                        className="text-yellow-600 hover:text-yellow-800"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleView(emp)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(emp._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {currentEmployees.length === 0 && (
                <tr>
                  <td colSpan="9" className="text-center py-6 text-gray-500">
                    No employees found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-gray-600">
            Showing {(page - 1) * rowsPerPage + 1}–
            {Math.min(page * rowsPerPage, filteredEmployees.length)} of{" "}
            {filteredEmployees.length}
          </p>
          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 rounded-lg ${
                  page === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {i + 1}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* View Details Dialog */}
      <Dialog
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        className="relative z-50"
      >
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          aria-hidden="true"
        />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md"
          >
            {selectedEmployee && (
              <div className="space-y-4">
                {/* Avatar with initials */}
                <div className="flex justify-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {selectedEmployee.first_name[0]}
                    {selectedEmployee.last_name[0]}
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-center text-gray-800">
                  {selectedEmployee.first_name} {selectedEmployee.last_name}
                </h2>
                <p className="text-center text-gray-500">
                  {selectedEmployee.designation} — {selectedEmployee.department}
                </p>

                <div className="space-y-2">
                  <p>
                    <span className="font-semibold">Employee Code:</span>{" "}
                    {selectedEmployee.employee_code}
                  </p>
                  <p>
                    <span className="font-semibold">Email:</span>{" "}
                    {selectedEmployee.email}
                  </p>
                  <p>
                    <span className="font-semibold">Phone:</span>{" "}
                    {selectedEmployee.phone_number}
                  </p>
                  <p>
                    <span className="font-semibold">Experience:</span>{" "}
                    {selectedEmployee.experience} years
                  </p>
                  <p>
                    <span className="font-semibold">Status:</span>{" "}
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        selectedEmployee.active === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {selectedEmployee.active}
                    </span>
                  </p>
                </div>

                <div className="flex justify-end mt-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setViewOpen(false)}
                    className="bg-gradient-to-r from-gray-400 to-gray-600 text-white px-4 py-2 rounded-lg shadow hover:from-gray-500 hover:to-gray-700"
                  >
                    Close
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </Dialog>
    </motion.div>
  );
}
