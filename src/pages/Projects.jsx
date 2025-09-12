// src/pages/Projects.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import {
  FolderKanban,
  Hash,
  CalendarDays,
  ClipboardList,
  Plus,
  Pencil,
  PauseCircle,
  X,
} from "lucide-react";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    project_code: "",
    project_name: "",
    description: "",
    start_date: "",
    end_date: "",
    status: "Planned",
  });
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [assignModal, setAssignModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [assignedEmployee, setAssignedEmployee] = useState("");

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role"); // Admin, Manager, Employee
  const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };
  const BASE_URL = "https://brd-backend-o7n9.onrender.com/api/projects";
  const EMP_URL = "http://localhost:5000/api/employees";

  // Fetch projects
  const fetchProjects = async () => {
    try {
      const res = await axios.get(BASE_URL, axiosConfig);
      setProjects(res.data.projects || []);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || "Failed to fetch projects");
    }
  };

  // Fetch employees for assigning projects (Admin/Manager)
  const fetchEmployees = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/employees",
        axiosConfig
      );

      // If backend returns { employees: [...] }
      if (res.data.employees) setEmployees(res.data.employees);
      // If backend returns array directly, use:
      else setEmployees(res.data || []);
    } catch (err) {
      console.error("Error fetching employees:", err);
      setEmployees([]);
    }
  };
  useEffect(() => {
    fetchProjects();
    if (role === "Admin" || role === "Manager") fetchEmployees();
  }, []);

  useEffect(() => {
    fetchProjects();
    if (role === "Admin" || role === "Manager") fetchEmployees();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      if (editingId) {
        await axios.put(`${BASE_URL}/${editingId}`, formData, axiosConfig);
        setMessage("✅ Project updated successfully");
      } else {
        await axios.post(BASE_URL, formData, axiosConfig);
        setMessage("✅ Project added successfully");
      }
      setFormData({
        project_code: "",
        project_name: "",
        description: "",
        start_date: "",
        end_date: "",
        status: "Planned",
      });
      setEditingId(null);
      setShowModal(false);
      fetchProjects();
    } catch (err) {
      setMessage(err.response?.data?.error || "❌ Error saving project");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (project) => {
    setEditingId(project._id);
    setFormData({
      project_code: project.project_code,
      project_name: project.project_name,
      description: project.description,
      start_date: project.start_date ? project.start_date.split("T")[0] : "",
      end_date: project.end_date ? project.end_date.split("T")[0] : "",
      status: project.status || "Planned",
    });
    setShowModal(true);
  };

  const handleDeactivate = async (id) => {
    if (!window.confirm("Mark this project as On Hold?")) return;
    try {
      await axios.put(`${BASE_URL}/${id}/deactivate`, {}, axiosConfig);
      setMessage("⚠️ Project marked as On Hold");
      fetchProjects();
    } catch (err) {
      setMessage(err.response?.data?.error || "❌ Error updating project");
    }
  };

  const handleAssign = (project) => {
    setSelectedProject(project);
    setAssignedEmployee("");
    setAssignModal(true);
  };

  const submitAssign = async () => {
    if (!assignedEmployee) {
      alert("Please select an employee");
      return;
    }
    try {
      await axios.put(
        `${BASE_URL}/${selectedProject._id}/assign`,
        { employeeId: assignedEmployee },
        axiosConfig
      );
      setMessage("✅ Project assigned successfully");
      setAssignModal(false);
      fetchProjects();
    } catch (err) {
      setMessage(err.response?.data?.error || "❌ Error assigning project");
    }
  };

  const statusColors = {
    Planned: "bg-gray-100 text-gray-600",
    "In Progress": "bg-blue-100 text-blue-600",
    "On Hold": "bg-yellow-100 text-yellow-600",
    Completed: "bg-green-100 text-green-600",
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen space-y-8">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Projects</h2>
          <button
            onClick={() => {
              setEditingId(null);
              setFormData({
                project_code: "",
                project_name: "",
                description: "",
                start_date: "",
                end_date: "",
                status: "Planned",
              });
              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition"
          >
            <Plus size={18} /> Add Project
          </button>
        </div>

        {message && (
          <p className="mb-4 text-center font-medium text-blue-600">
            {message}
          </p>
        )}

        {/* Project Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-3 text-left">Code</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Start</th>
                <th className="p-3 text-left">End</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {projects.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500">
                    No projects found
                  </td>
                </tr>
              ) : (
                projects.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50 transition">
                    <td className="p-3">{p.project_code}</td>
                    <td className="p-3 font-medium">{p.project_name}</td>
                    <td className="p-3">
                      {p.start_date
                        ? new Date(p.start_date).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="p-3">
                      {p.end_date
                        ? new Date(p.end_date).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          statusColors[p.status] || "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3 flex justify-center gap-2 flex-wrap">
                      <button
                        onClick={() => handleEdit(p)}
                        className="flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded-lg text-sm"
                      >
                        <Pencil size={14} /> Edit
                      </button>
                      <button
                        onClick={() => handleDeactivate(p._id)}
                        className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-lg text-sm"
                      >
                        <PauseCircle size={14} /> Hold
                      </button>
                      {(role === "Admin" || role === "Manager") && (
                        <button
                          onClick={() => handleAssign(p)}
                          className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded-lg text-sm"
                        >
                          Assign
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Project Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-2xl p-6 rounded-2xl shadow-lg relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-semibold mb-6 text-gray-800">
              {editingId ? "Edit Project" : "Add Project"}
            </h2>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Project Code */}
              <div className="relative">
                <Hash
                  className="absolute left-3 top-3 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  name="project_code"
                  value={formData.project_code}
                  onChange={handleChange}
                  placeholder="Project Code"
                  className="pl-10 p-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Project Name */}
              <div className="relative">
                <FolderKanban
                  className="absolute left-3 top-3 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  name="project_name"
                  value={formData.project_name}
                  onChange={handleChange}
                  placeholder="Project Name"
                  className="pl-10 p-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Start Date */}
              <div className="relative">
                <CalendarDays
                  className="absolute left-3 top-3 text-gray-400"
                  size={18}
                />
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  className="pl-10 p-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* End Date */}
              <div className="relative">
                <CalendarDays
                  className="absolute left-3 top-3 text-gray-400"
                  size={18}
                />
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  className="pl-10 p-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Description */}
              <div className="relative md:col-span-2">
                <ClipboardList
                  className="absolute left-3 top-3 text-gray-400"
                  size={18}
                />
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Project Description"
                  className="pl-10 p-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              {/* Status */}
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="Planned">Planned</option>
                <option value="In Progress">In Progress</option>
                <option value="On Hold">On Hold</option>
                <option value="Completed">Completed</option>
              </select>

              <button
                type="submit"
                disabled={loading}
                className="col-span-1 md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg shadow-md font-medium transition"
              >
                {loading
                  ? "Saving..."
                  : editingId
                  ? "Update Project"
                  : "Add Project"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Assign Project Modal */}
      {assignModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-lg relative">
            <button
              onClick={() => setAssignModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-semibold mb-6 text-gray-800">
              Assign Project: {selectedProject.project_name}
            </h2>

            <select
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 mb-4"
              value={assignedEmployee}
              onChange={(e) => setAssignedEmployee(e.target.value)}
            >
              <option value="">Select Employee</option>
              {employees.length > 0 ? (
                employees.map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.name} {emp.email ? `(${emp.email})` : ""}
                  </option>
                ))
              ) : (
                <option disabled>No employees available</option>
              )}
            </select>

            <button
              onClick={submitAssign}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition"
            >
              Assign
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
