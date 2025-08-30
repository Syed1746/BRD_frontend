// src/pages/Projects.jsx
import { useState, useEffect } from "react";
import axios from "axios";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    project_code: "",
    project_name: "",
    description: "",
    start_date: "",
    end_date: "",
    status: "Active",
  });
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // ✅ Change this to your backend base URL
  const BASE_URL = "https://brd-backend-o7n9.onrender.com/api/projects";

  // Fetch projects from API
  const fetchProjects = async () => {
    try {
      const res = await axios.get(BASE_URL, axiosConfig);
      setProjects(res.data.projects);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || "Failed to fetch projects");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add or update project
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      if (editingId) {
        await axios.put(`${BASE_URL}/${editingId}`, formData, axiosConfig);
        setMessage("Project updated successfully");
        setEditingId(null);
      } else {
        await axios.post(BASE_URL, formData, axiosConfig);
        setMessage("Project added successfully");
      }
      setFormData({
        project_code: "",
        project_name: "",
        description: "",
        start_date: "",
        end_date: "",
        status: "Active",
      });
      fetchProjects();
    } catch (err) {
      setMessage(err.response?.data?.error || "Error saving project");
    } finally {
      setLoading(false);
    }
  };

  // Edit existing project
  const handleEdit = (project) => {
    setEditingId(project._id);
    setFormData({
      project_code: project.project_code,
      project_name: project.project_name,
      description: project.description,
      start_date: project.start_date ? project.start_date.split("T")[0] : "",
      end_date: project.end_date ? project.end_date.split("T")[0] : "",
      status: project.status || "Active",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Deactivate project (mark On Hold)
  const handleDeactivate = async (id) => {
    if (!window.confirm("Mark this project as On Hold?")) return;
    try {
      await axios.put(`${BASE_URL}/${id}/deactivate`, {}, axiosConfig);
      setMessage("Project marked as On Hold");
      fetchProjects();
    } catch (err) {
      setMessage(err.response?.data?.error || "Error updating project");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {editingId ? "Edit Project" : "Add Project"}
        </h2>

        {message && (
          <p className="mb-4 text-center text-blue-600 font-medium">
            {message}
          </p>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
        >
          <input
            type="text"
            placeholder="Project Code"
            name="project_code"
            value={formData.project_code}
            onChange={handleChange}
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
            required
          />
          <input
            type="text"
            placeholder="Project Name"
            name="project_name"
            value={formData.project_name}
            onChange={handleChange}
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
            required
          />
          <input
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
          />
          <input
            type="date"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
          />
          <textarea
            placeholder="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 col-span-1 md:col-span-3 w-full"
          />
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
          >
            <option value="Active">Active</option>
            <option value="On Hold">On Hold</option>
          </select>
          <button
            type="submit"
            className="col-span-1 md:col-span-3 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded transition"
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : editingId
              ? "Update Project"
              : "Add Project"}
          </button>
        </form>

        {/* Projects Table */}
        <h3 className="text-xl font-semibold mb-4">Project List</h3>
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">Code</th>
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Start Date</th>
                <th className="border px-4 py-2">End Date</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    No projects found
                  </td>
                </tr>
              )}
              {projects.map((p) => (
                <tr key={p._id} className="text-center">
                  <td className="border px-4 py-2">{p.project_code}</td>
                  <td className="border px-4 py-2">{p.project_name}</td>
                  <td className="border px-4 py-2">
                    {p.start_date
                      ? new Date(p.start_date).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="border px-4 py-2">
                    {p.end_date
                      ? new Date(p.end_date).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="border px-4 py-2">{p.status}</td>
                  <td className="border px-4 py-2 flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(p)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeactivate(p._id)}
                      className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded transition"
                    >
                      On Hold
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
