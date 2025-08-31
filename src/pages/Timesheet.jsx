import { useState, useEffect } from "react";
import axios from "axios";

export default function Timesheet() {
  const [timesheets, setTimesheets] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);

  const [formData, setFormData] = useState({
    employee_id: "",
    project_id: "",
    date: new Date().toISOString().split("T")[0],
    hours_worked: "",
    task_description: "",
  });

  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const BASE_URL = "https://brd-backend-o7n9.onrender.com/api";
  const token = localStorage.getItem("token");
  const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };

  // --- Helpers
  const safeSetMessage = (err, fallback) => {
    setMessage(
      err?.response?.data?.error || err?.response?.data?.message || fallback
    );
  };

  // --- Fetch Employees & Projects
  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/employees`, axiosConfig);
      setEmployees(
        Array.isArray(res.data) ? res.data : res.data?.employees || []
      );
    } catch (err) {
      console.error("Error fetching employees:", err);
      safeSetMessage(err, "Error fetching employees");
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/projects`, axiosConfig);
      const arr = Array.isArray(res.data) ? res.data : res.data?.projects || [];
      setProjects(arr);
    } catch (err) {
      console.error("Error fetching projects:", err);
      safeSetMessage(err, "Error fetching projects");
    }
  };

  // --- Fetch Timesheets
  const fetchTimesheets = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/timesheets`, axiosConfig);
      setTimesheets(res.data?.timesheets || []);
    } catch (err) {
      console.error("Error fetching timesheets:", err);
      safeSetMessage(err, "Error fetching timesheets");
    }
  };

  useEffect(() => {
    if (!token) {
      setMessage("No token found. Please log in again.");
      return;
    }
    fetchEmployees();
    fetchProjects();
    fetchTimesheets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Form handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.employee_id) return setMessage("Please select an employee.");
    if (!formData.project_id) return setMessage("Please select a project.");
    if (!formData.hours_worked) return setMessage("Please enter hours worked.");

    setLoading(true);
    setMessage("");

    const payload = {
      ...formData,
      hours_worked: Number(formData.hours_worked),
    };

    try {
      if (editingId) {
        await axios.put(
          `${BASE_URL}/timesheets/${editingId}`,
          payload,
          axiosConfig
        );
        setMessage("Timesheet updated successfully");
        setEditingId(null);
      } else {
        await axios.post(`${BASE_URL}/timesheets`, payload, axiosConfig);
        setMessage("Timesheet added successfully");
      }

      setFormData({
        employee_id: "",
        project_id: "",
        date: new Date().toISOString().split("T")[0],
        hours_worked: "",
        task_description: "",
      });

      fetchTimesheets();
    } catch (err) {
      console.error("Error saving timesheet:", err);
      safeSetMessage(err, "Error saving timesheet");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (ts) => {
    setEditingId(ts._id);
    setFormData({
      employee_id: ts.employee_id?._id || ts.employee_id || "",
      project_id: ts.project_id?._id || ts.project_id || "",
      date: ts.date
        ? ts.date.split("T")[0]
        : new Date().toISOString().split("T")[0],
      hours_worked: ts.hours_worked ?? ts.hours ?? "",
      task_description: ts.task_description ?? ts.description ?? "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // --- UI
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {editingId ? "Edit Timesheet" : "Add Timesheet"}
        </h2>

        {message && (
          <p className="mb-4 text-center text-blue-600 font-medium">
            {message}
          </p>
        )}

        {/* Timesheet Form */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
        >
          {/* Employee dropdown */}
          <select
            name="employee_id"
            value={formData.employee_id}
            onChange={handleChange}
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
            required
          >
            <option value="">Select Employee</option>
            {employees.map((emp) => (
              <option key={emp._id} value={emp._id}>
                {emp.first_name} {emp.last_name} ({emp.employee_code})
              </option>
            ))}
          </select>

          {/* Project dropdown */}
          <select
            name="project_id"
            value={formData.project_id}
            onChange={handleChange}
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
            required
          >
            <option value="">Select Project</option>
            {projects.map((p) => (
              <option key={p._id} value={p._id}>
                {p.project_name ||
                  p.name ||
                  p.project_code ||
                  "Unnamed Project"}
              </option>
            ))}
          </select>

          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
            required
          />

          <input
            type="number"
            name="hours_worked"
            placeholder="Hours Worked"
            value={formData.hours_worked}
            onChange={handleChange}
            min="0"
            step="0.25"
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
            required
          />

          <input
            type="text"
            name="task_description"
            placeholder="Description / Task"
            value={formData.task_description}
            onChange={handleChange}
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 col-span-1 md:col-span-2 w-full"
          />

          <button
            type="submit"
            className="col-span-1 md:col-span-3 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded transition"
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : editingId
              ? "Update Timesheet"
              : "Add Timesheet"}
          </button>
        </form>

        {/* Timesheet Records */}
        <h3 className="text-xl font-semibold mb-4">Timesheet Records</h3>
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">Employee</th>
                <th className="border px-4 py-2">Project</th>
                <th className="border px-4 py-2">Date</th>
                <th className="border px-4 py-2">Hours</th>
                <th className="border px-4 py-2">Description</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {timesheets.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    No timesheets found
                  </td>
                </tr>
              )}
              {timesheets.map((ts) => (
                <tr key={ts._id} className="text-center">
                  <td className="border px-4 py-2">
                    {ts.employee_id
                      ? `${ts.employee_id.first_name || ""} ${
                          ts.employee_id.last_name || ""
                        } (${ts.employee_id.employee_code || ""})`
                      : "—"}
                  </td>
                  <td className="border px-4 py-2">
                    {ts.project_id
                      ? ts.project_id.project_name ||
                        ts.project_id.name ||
                        ts.project_id.project_code ||
                        "Unnamed"
                      : "—"}
                  </td>
                  <td className="border px-4 py-2">
                    {ts.date ? new Date(ts.date).toLocaleDateString() : "—"}
                  </td>
                  <td className="border px-4 py-2">
                    {ts.hours_worked ?? ts.hours ?? "—"}
                  </td>
                  <td className="border px-4 py-2">
                    {ts.task_description ?? ts.description ?? "—"}
                  </td>
                  <td className="border px-4 py-2">
                    {ts.status || "Submitted"}
                  </td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleEdit(ts)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded transition"
                    >
                      Edit
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
