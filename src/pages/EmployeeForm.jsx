import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../config";
import toast, { Toaster } from "react-hot-toast";

export default function EmployeeForm() {
  console.log("EmployeeForm render");

  const navigate = useNavigate();
  const { id } = useParams();
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

  useEffect(() => {
    if (!id) return;
    let mounted = true;

    const fetchEmployee = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${BASE_URL}/api/employees/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (mounted) {
          const data = res.data.employee || res.data;

          setFormData((prev) => ({
            ...prev,
            // only set if still empty (don’t overwrite user typing)
            employee_code: prev.employee_code || data.employee_code || "",
            first_name: prev.first_name || data.first_name || "",
            last_name: prev.last_name || data.last_name || "",
            email: prev.email || data.email || "",
            phone_number: prev.phone_number || data.phone_number || "",
            department: prev.department || data.department || "",
            designation: prev.designation || data.designation || "",
            experience: prev.experience || data.experience || "",
            active: prev.active || data.active || "Active",
          }));
        }
      } catch {
        toast.error("Failed to load employee details!");
      }
    };

    fetchEmployee();
    return () => {
      mounted = false;
    };
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (id) {
        await axios.put(`${BASE_URL}/api/employees/${id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Employee updated successfully!");
      } else {
        await axios.post(`${BASE_URL}/api/employees`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Employee added successfully!");
      }
      setTimeout(() => navigate("/employees"), 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving employee!");
    }
  };

  // Simple input field
  const InputField = ({ label, type = "text", field, required }) => (
    <div className="flex flex-col">
      <label className="mb-1 text-sm font-semibold text-gray-700">
        {label}
      </label>
      <input
        type={type}
        value={formData[field] ?? ""}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, [field]: e.target.value }))
        }
        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
        required={required}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <Toaster position="top-right" />
      <div className="bg-white rounded-lg shadow-md w-full max-w-3xl p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          {id ? "Update Employee" : "Add New Employee"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <InputField label="Employee Code" field="employee_code" required />
          <InputField label="First Name" field="first_name" required />
          <InputField label="Last Name" field="last_name" />
          <InputField label="Email" type="email" field="email" required />
          <InputField label="Phone Number" field="phone_number" />
          <InputField label="Department" field="department" />
          <InputField label="Designation" field="designation" />
          <InputField label="Experience" field="experience" />

          {/* Status Dropdown */}
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-semibold text-gray-700">
              Status
            </label>
            <select
              value={formData.active}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, active: e.target.value }))
              }
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="md:col-span-2 flex justify-between mt-6">
            <button
              type="button"
              onClick={() => navigate("/employees")}
              className="px-6 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            >
              {id ? "Update Employee" : "Add Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
