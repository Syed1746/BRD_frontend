// src/pages/Timesheet.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { Loader2, Plus } from "lucide-react";

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
  const [pageLoading, setPageLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  const BASE_URL = "https://brd-backend-o7n9.onrender.com/api";
  const token = localStorage.getItem("token");
  const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };

  const safeSetMessage = (err, fallback) => {
    setMessage(
      err?.response?.data?.error || err?.response?.data?.message || fallback
    );
  };

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/employees`, axiosConfig);
      setEmployees(
        Array.isArray(res.data) ? res.data : res.data?.employees || []
      );
    } catch (err) {
      safeSetMessage(err, "Error fetching employees");
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/projects`, axiosConfig);
      setProjects(
        Array.isArray(res.data) ? res.data : res.data?.projects || []
      );
    } catch (err) {
      safeSetMessage(err, "Error fetching projects");
    }
  };

  const fetchTimesheets = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/timesheets`, axiosConfig);
      setTimesheets(res.data?.timesheets || []);
    } catch (err) {
      safeSetMessage(err, "Error fetching timesheets");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      setMessage("No token found. Please log in again.");
      setPageLoading(false);
      return;
    }
    Promise.all([fetchEmployees(), fetchProjects(), fetchTimesheets()]);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
        setMessage("✅ Timesheet updated successfully");
        setEditingId(null);
      } else {
        await axios.post(`${BASE_URL}/timesheets`, payload, axiosConfig);
        setMessage("✅ Timesheet added successfully");
      }

      setFormData({
        employee_id: "",
        project_id: "",
        date: new Date().toISOString().split("T")[0],
        hours_worked: "",
        task_description: "",
      });

      setShowModal(false);
      fetchTimesheets();
    } catch (err) {
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
    setShowModal(true);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen space-y-8">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-2xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-blue-600">
            Timesheet Records
          </h2>
          <button
            onClick={() => {
              setEditingId(null);
              setFormData({
                employee_id: "",
                project_id: "",
                date: new Date().toISOString().split("T")[0],
                hours_worked: "",
                task_description: "",
              });
              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            <Plus className="w-5 h-5" /> Add Timesheet
          </button>
        </div>

        {message && (
          <p className="mb-4 text-center text-blue-600 font-medium">
            {message}
          </p>
        )}

        {pageLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-sm text-gray-700">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-4 py-3">Employee</th>
                  <th className="px-4 py-3">Project</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Hours</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {timesheets.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="text-center py-6 text-gray-500 italic"
                    >
                      No timesheets found
                    </td>
                  </tr>
                ) : (
                  timesheets.map((ts) => (
                    <tr
                      key={ts._id}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      <td className="px-4 py-3">
                        {ts.employee_id
                          ? `${ts.employee_id.first_name || ""} ${
                              ts.employee_id.last_name || ""
                            } (${ts.employee_id.employee_code || ""})`
                          : "—"}
                      </td>
                      <td className="px-4 py-3">
                        {ts.project_id
                          ? ts.project_id.project_name ||
                            ts.project_id.name ||
                            ts.project_id.project_code ||
                            "Unnamed"
                          : "—"}
                      </td>
                      <td className="px-4 py-3">
                        {ts.date ? new Date(ts.date).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-4 py-3">
                        {ts.hours_worked ?? ts.hours ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        {ts.task_description ?? ts.description ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            ts.status === "Approved"
                              ? "bg-green-100 text-green-600"
                              : "bg-yellow-100 text-yellow-600"
                          }`}
                        >
                          {ts.status || "Submitted"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleEdit(ts)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded-lg transition"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-2xl">
            <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">
              {editingId ? "Edit Timesheet" : "Add Timesheet"}
            </h2>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <select
                name="employee_id"
                value={formData.employee_id}
                onChange={handleChange}
                className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
                required
              >
                <option value="">Select Employee</option>
                {employees.map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.first_name} {emp.last_name} ({emp.employee_code})
                  </option>
                ))}
              </select>

              <select
                name="project_id"
                value={formData.project_id}
                onChange={handleChange}
                className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
                required
              >
                <option value="">Select Project</option>
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.project_name || p.name || p.project_code || "Unnamed"}
                  </option>
                ))}
              </select>

              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
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
                className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
                required
              />

              <input
                type="text"
                name="task_description"
                placeholder="Description / Task"
                value={formData.task_description}
                onChange={handleChange}
                className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 col-span-1 md:col-span-2"
              />

              <div className="col-span-1 md:col-span-2 flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center gap-2"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {loading
                    ? "Saving..."
                    : editingId
                    ? "Update Timesheet"
                    : "Add Timesheet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
