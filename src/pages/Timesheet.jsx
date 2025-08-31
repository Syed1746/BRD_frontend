import { useState, useEffect } from "react";
import axios from "axios";

export default function Timesheet() {
  const [timesheets, setTimesheets] = useState([]);
  const [formData, setFormData] = useState({
    employee_id: "",
    project_id: "",
    date: new Date().toISOString().split("T")[0],
    hours: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const BASE_URL = "https://brd-backend-o7n9.onrender.com/api";

  // Fetch all timesheets
  const fetchTimesheets = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/timesheets`);
      setTimesheets(res.data.timesheets || []);
    } catch (err) {
      console.error("Error fetching timesheets:", err);
    }
  };

  useEffect(() => {
    fetchTimesheets();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle add/update timesheet
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      if (editingId) {
        await axios.put(`${BASE_URL}/timesheets/${editingId}`, formData);
        setMessage("Timesheet updated successfully");
        setEditingId(null);
      } else {
        await axios.post(`${BASE_URL}/timesheets`, formData);
        setMessage("Timesheet added successfully");
      }
      setFormData({
        employee_id: "",
        project_id: "",
        date: new Date().toISOString().split("T")[0],
        hours: "",
        description: "",
      });
      fetchTimesheets();
    } catch (err) {
      console.error("Error saving timesheet:", err);
      setMessage(err.response?.data?.error || "Error saving timesheet");
    } finally {
      setLoading(false);
    }
  };

  // Handle editing timesheet
  const handleEdit = (ts) => {
    setEditingId(ts._id);
    setFormData({
      employee_id: ts.employee_id?._id || ts.employee_id,
      project_id: ts.project_id?._id || ts.project_id,
      date: ts.date ? ts.date.split("T")[0] : "",
      hours: ts.hours,
      description: ts.description,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
          <input
            type="text"
            name="employee_id"
            placeholder="Employee ID"
            value={formData.employee_id}
            onChange={handleChange}
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
            required
          />
          <input
            type="text"
            name="project_id"
            placeholder="Project ID"
            value={formData.project_id}
            onChange={handleChange}
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
            required
          />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
          />
          <input
            type="number"
            name="hours"
            placeholder="Hours Worked"
            value={formData.hours}
            onChange={handleChange}
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
            required
          />
          <input
            type="text"
            name="description"
            placeholder="Description / Task"
            value={formData.description}
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
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {timesheets.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    No timesheets found
                  </td>
                </tr>
              )}
              {timesheets.map((ts) => (
                <tr key={ts._id} className="text-center">
                  <td className="border px-4 py-2">
                    {ts.employee_id?.name || ts.employee_id}
                  </td>
                  <td className="border px-4 py-2">
                    {ts.project_id?.name || ts.project_id}
                  </td>
                  <td className="border px-4 py-2">
                    {ts.date ? new Date(ts.date).toLocaleDateString() : "-"}
                  </td>
                  <td className="border px-4 py-2">{ts.hours}</td>
                  <td className="border px-4 py-2">{ts.description}</td>
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
