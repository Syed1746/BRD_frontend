import React, { useEffect, useState } from "react";
import axios from "axios";
import { Dialog } from "@headlessui/react";

export default function EmployeePage() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    employee_code: "",
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    date_of_birth: "",
    date_of_joining: "",
    department: "",
    designation: "",
    status: "Active",
  });
  const [editId, setEditId] = useState(null);

  const BASE_URL = "https://brd-backend-o7n9.onrender.com"; // ✅ Deployed backend URL

  // Fetch Employees
  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem("token"); // after login, save token
      const res = await axios.get(`${BASE_URL}/api/employee`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEmployees(res.data.GetEmployee || []);
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
        await axios.put(`${BASE_URL}/api/employee/${editId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        await axios.post(`${BASE_URL}/api/employee`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      fetchEmployees(); // refresh table
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
      date_of_birth: "",
      date_of_joining: "",
      department: "",
      designation: "",
      status: "Active",
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
      date_of_birth: emp.date_of_birth?.substring(0, 10),
      date_of_joining: emp.date_of_joining?.substring(0, 10),
      department: emp.department,
      designation: emp.designation,
      status: emp.active || "Active",
    });
    setEditId(emp._id);
    setIsOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Employee Management</h2>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => setIsOpen(true)}
        >
          + Add Employee
        </button>
      </div>

      <input
        type="text"
        placeholder="Search by name..."
        className="border p-2 mb-4 w-full rounded"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <table className="w-full border rounded shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Code</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Phone</th>
            <th className="p-2 border">Department</th>
            <th className="p-2 border">Designation</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees
            .filter((e) =>
              `${e.first_name} ${e.last_name}`
                .toLowerCase()
                .includes(search.toLowerCase())
            )
            .map((emp) => (
              <tr key={emp._id}>
                <td className="p-2 border">{emp.employee_code}</td>
                <td className="p-2 border">
                  {emp.first_name} {emp.last_name}
                </td>
                <td className="p-2 border">{emp.email}</td>
                <td className="p-2 border">{emp.phone_number}</td>
                <td className="p-2 border">{emp.department}</td>
                <td className="p-2 border">{emp.designation}</td>
                <td className="p-2 border">{emp.active}</td>
                <td className="p-2 border">
                  <button
                    onClick={() => handleEdit(emp)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="bg-white rounded p-6 w-96 max-h-[90vh] overflow-y-auto">
            <Dialog.Title className="text-lg font-bold mb-4">
              {editId ? "Edit Employee" : "Add Employee"}
            </Dialog.Title>
            <form onSubmit={handleSubmit}>
              {[
                "employee_code",
                "first_name",
                "last_name",
                "email",
                "phone_number",
                "date_of_birth",
                "date_of_joining",
                "department",
                "designation",
                "status",
              ].map((field) => (
                <input
                  key={field}
                  type={
                    field.includes("date")
                      ? "date"
                      : field === "email"
                      ? "email"
                      : "text"
                  }
                  placeholder={field.replace("_", " ")}
                  className="w-full border p-2 mb-2 rounded"
                  value={formData[field]}
                  onChange={(e) =>
                    setFormData({ ...formData, [field]: e.target.value })
                  }
                />
              ))}
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded w-full"
              >
                {editId ? "Update" : "Add"}
              </button>
            </form>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
