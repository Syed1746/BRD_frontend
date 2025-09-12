import React, { useEffect, useState, Fragment } from "react";
import axios from "axios";
import { Dialog, Listbox, Transition } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MoreVertical,
  Download,
  X,
  Search,
  Plus,
  Check,
  ChevronDown,
} from "lucide-react";
// import { BASE_URL } from "../../config";

export default function EmployeePage() {
  const BASE_URL = "https://brd-backend-o7n9.onrender.com";
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Filters
  const [departmentFilter, setDepartmentFilter] = useState(null);
  const [designationFilter, setDesignationFilter] = useState(null);
  const [addOpen, setAddOpen] = useState(false);

  // Add Employee form state
  const [form, setForm] = useState({
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
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Add Employee Submit
  const handleAddEmployee = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${BASE_URL}/api/employees`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddOpen(false);
      setForm({
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
      fetchEmployees();
    } catch (err) {
      console.error(
        "Failed to add employee:",
        err.response?.data || err.message
      );
      alert(err.response?.data?.error || "Failed to add employee");
    }
  };

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

  // Unique department/designation options
  const departments = [
    ...new Set(employees.map((e) => e.department).filter(Boolean)),
  ];
  const designations = [
    ...new Set(employees.map((e) => e.designation).filter(Boolean)),
  ];

  // Export CSV
  const handleExportCSV = () => {
    const headers = ["Employee Code", "First Name", "Last Name", "Email"];
    const csvRows = [
      headers.join(","),
      ...employees.map((e) =>
        [e.employee_code, e.first_name, e.last_name, e.email].join(",")
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

  // Filtered employees
  const filteredEmployees = employees.filter((e) => {
    const matchesSearch = `${e.first_name} ${e.last_name}`
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesDept = departmentFilter
      ? e.department === departmentFilter
      : true;
    const matchesDesig = designationFilter
      ? e.designation === designationFilter
      : true;
    return matchesSearch && matchesDept && matchesDesig;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredEmployees.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedEmployees = filteredEmployees.slice(
    startIndex,
    startIndex + pageSize
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen space-y-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen space-y-8"
      >
        <div className="bg-white rounded-xl shadow-lg p-5">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-5 gap-4">
            <h2 className="text-2xl font-bold text-gray-800">Employees</h2>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 hover:shadow transition"
              >
                <Download size={16} /> Export
              </button>
              <button
                onClick={() => setAddOpen(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 hover:shadow transition"
              >
                <Plus size={16} /> Add Employee
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-6 border-b mb-5 text-gray-600 text-sm font-medium">
            {["Manage Employees", "Organize Chart", "Leave Request"].map(
              (tab, i) => (
                <button
                  key={tab}
                  className={`pb-3 transition ${
                    i === 0
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "border-b-2 border-transparent hover:border-blue-400 hover:text-blue-600"
                  }`}
                >
                  {tab}
                </button>
              )
            )}
          </div>

          {/* Search + Filters */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
            {/* Search */}
            <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg shadow-sm w-full md:w-1/3">
              <Search size={18} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search employees..."
                className="bg-transparent w-full outline-none text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="text-red-500 hover:text-red-700"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              {/* Department Filter */}
              <Listbox value={departmentFilter} onChange={setDepartmentFilter}>
                <div className="relative">
                  <Listbox.Button className="flex items-center gap-2 border px-3 py-2 rounded-lg text-sm hover:bg-gray-50 min-w-[160px] justify-between">
                    {departmentFilter || "Department"} <ChevronDown size={16} />
                  </Listbox.Button>
                  <Transition
                    as={motion.div}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    leave={{ opacity: 0, y: -5 }}
                    className="absolute mt-1 w-full bg-white shadow-lg rounded-lg z-20"
                  >
                    <Listbox.Options className="max-h-60 overflow-auto p-2 text-sm">
                      <Listbox.Option
                        value={null}
                        className="cursor-pointer px-3 py-2 rounded hover:bg-gray-100 flex items-center gap-2"
                      >
                        <X size={14} /> Clear
                      </Listbox.Option>
                      {departments.map((dept) => (
                        <Listbox.Option
                          key={dept}
                          value={dept}
                          className="cursor-pointer px-3 py-2 rounded hover:bg-gray-100 flex items-center justify-between"
                        >
                          {dept}
                          {departmentFilter === dept && <Check size={14} />}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>

              {/* Designation Filter */}
              <Listbox
                value={designationFilter}
                onChange={setDesignationFilter}
              >
                <div className="relative">
                  <Listbox.Button className="flex items-center gap-2 border px-3 py-2 rounded-lg text-sm hover:bg-gray-50 min-w-[160px] justify-between">
                    {designationFilter || "Designation"}{" "}
                    <ChevronDown size={16} />
                  </Listbox.Button>
                  <Transition
                    as={motion.div}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    leave={{ opacity: 0, y: -5 }}
                    className="absolute mt-1 w-full bg-white shadow-lg rounded-lg z-20"
                  >
                    <Listbox.Options className="max-h-60 overflow-auto p-2 text-sm">
                      <Listbox.Option
                        value={null}
                        className="cursor-pointer px-3 py-2 rounded hover:bg-gray-100 flex items-center gap-2"
                      >
                        <X size={14} /> Clear
                      </Listbox.Option>
                      {designations.map((des) => (
                        <Listbox.Option
                          key={des}
                          value={des}
                          className="cursor-pointer px-3 py-2 rounded hover:bg-gray-100 flex items-center justify-between"
                        >
                          {des}
                          {designationFilter === des && <Check size={14} />}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
            </div>
          </div>

          {/* Employee List */}
          <div className="overflow-hidden rounded-xl border">
            <div className="grid grid-cols-6 bg-gray-100 text-sm font-semibold text-gray-600 px-4 py-3">
              <span>Name</span>
              <span>Email</span>
              <span>Department</span>
              <span>Designation</span>
              <span>Status</span>
              <span className="text-right">Action</span>
            </div>
            <AnimatePresence>
              {paginatedEmployees.map((emp, i) => (
                <motion.div
                  key={emp._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="grid grid-cols-6 items-center px-5 py-4 text-sm hover:bg-gray-50 border-t"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700 shadow-sm">
                      {emp.first_name[0]}
                      {emp.last_name[0]}
                    </div>
                    <span className="font-medium text-gray-800">
                      {emp.first_name} {emp.last_name}
                    </span>
                  </div>
                  <span className="text-gray-600 truncate">{emp.email}</span>
                  <span className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-700">
                    {emp.department || "N/A"}
                  </span>
                  <span className="text-gray-700">
                    {emp.designation || "N/A"}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      emp.active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {emp.active ? "Active" : "Inactive"}
                  </span>
                  <div className="text-right">
                    <button
                      onClick={() => {
                        setSelectedEmployee(emp);
                        setViewOpen(true);
                      }}
                      className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-800"
                    >
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredEmployees.length === 0 && (
              <p className="text-center text-gray-500 py-6">
                No employees found.
              </p>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex justify-center mt-6"
            >
              <div className="flex items-center gap-2 bg-white rounded-lg shadow-md px-4 py-2">
                {/* Prev */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition ${
                    currentPage === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Prev
                </button>

                {/* Page numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition ${
                        currentPage === page
                          ? "bg-blue-600 text-white shadow"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}

                {/* Next */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition ${
                    currentPage === totalPages
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Next
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* View Employee Dialog */}
        <Dialog
          open={viewOpen}
          onClose={() => setViewOpen(false)}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md relative"
            >
              {selectedEmployee && (
                <div className="space-y-6">
                  {/* Close */}
                  <button
                    onClick={() => setViewOpen(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                  >
                    <X size={20} />
                  </button>

                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold shadow-md">
                      {selectedEmployee.first_name[0]}
                      {selectedEmployee.last_name[0]}
                    </div>
                    <h2 className="text-xl font-bold mt-4 text-gray-800">
                      {selectedEmployee.first_name} {selectedEmployee.last_name}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {selectedEmployee.designation} —{" "}
                      {selectedEmployee.department}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <p>
                      <span className="font-semibold">Employee Code:</span>
                      <br /> {selectedEmployee.employee_code}
                    </p>
                    <p>
                      <span className="font-semibold">Email:</span>
                      <br /> {selectedEmployee.email}
                    </p>
                    <p>
                      <span className="font-semibold">Phone:</span>
                      <br /> {selectedEmployee.phone_number}
                    </p>
                    <p>
                      <span className="font-semibold">Experience:</span>
                      <br /> {selectedEmployee.experience} years
                    </p>
                  </div>

                  <div className="text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        selectedEmployee.active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {selectedEmployee.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </Dialog>
        <Transition appear show={addOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-50"
            onClose={() => setAddOpen(false)}
          >
            {/* Overlay */}
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
            </Transition.Child>

            {/* Panel */}
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95 translate-y-4"
                enterTo="opacity-100 scale-100 translate-y-0"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100 translate-y-0"
                leaveTo="opacity-0 scale-95 translate-y-4"
              >
                <Dialog.Panel className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 relative">
                  {/* Header */}
                  <div className="flex justify-between items-center border-b pb-4 mb-6">
                    <Dialog.Title className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                      <Plus className="w-6 h-6 text-blue-600" /> Add New
                      Employee
                    </Dialog.Title>
                    <button
                      onClick={() => setAddOpen(false)}
                      className="p-2 rounded-full hover:bg-gray-100 transition"
                      aria-label="Close"
                    >
                      <X size={22} className="text-gray-500" />
                    </button>
                  </div>

                  {/* Form */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleAddEmployee();
                    }}
                    className="grid grid-cols-2 gap-x-6 gap-y-5"
                  >
                    {/* Floating Input Fields */}
                    {[
                      {
                        name: "employee_code",
                        label: "Employee Code",
                        type: "text",
                        col: 2,
                      },
                      {
                        name: "first_name",
                        label: "First Name",
                        type: "text",
                        col: 1,
                      },
                      {
                        name: "last_name",
                        label: "Last Name",
                        type: "text",
                        col: 1,
                      },
                      { name: "email", label: "Email", type: "email", col: 1 },
                      {
                        name: "phone_number",
                        label: "Phone Number",
                        type: "text",
                        col: 1,
                      },
                      {
                        name: "department",
                        label: "Department",
                        type: "text",
                        col: 1,
                      },
                      {
                        name: "designation",
                        label: "Designation",
                        type: "text",
                        col: 1,
                      },
                    ].map((field) => (
                      <div
                        key={field.name}
                        className={`relative ${
                          field.col === 2 ? "col-span-2" : "col-span-1"
                        }`}
                      >
                        <input
                          type={field.type}
                          name={field.name}
                          value={form[field.name]}
                          onChange={handleChange}
                          placeholder=" "
                          className="peer w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                        <label className="absolute left-3 top-2.5 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2.5 peer-focus:text-sm peer-focus:text-blue-600">
                          {field.label}
                        </label>
                      </div>
                    ))}

                    {/* Date Fields with label above input */}
                    <div className="col-span-1">
                      <label className="block text-sm text-gray-500 mb-1">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        name="date_of_birth"
                        value={form.date_of_birth}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>

                    <div className="col-span-1">
                      <label className="block text-sm text-gray-500 mb-1">
                        Date of Joining
                      </label>
                      <input
                        type="date"
                        name="date_of_joining"
                        value={form.date_of_joining}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>

                    {/* Status Select */}
                    <div className="col-span-2 relative">
                      <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        className="peer w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                      <label className="absolute left-3 -top-2 bg-white px-1 text-xs text-blue-600">
                        Status
                      </label>
                    </div>

                    {/* Footer Buttons */}
                    <div className="col-span-2 flex justify-end mt-6 gap-3">
                      <button
                        type="button"
                        onClick={() => setAddOpen(false)}
                        className="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-lg transition transform hover:scale-105"
                      >
                        Save Employee
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      </motion.div>
    </div>
  );
}
