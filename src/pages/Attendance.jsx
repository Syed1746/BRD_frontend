import { useState, useEffect } from "react";
import axios from "axios";

export default function Attendance() {
  const [employees, setEmployees] = useState([]);
  const [employeeId, setEmployeeId] = useState("");
  const [inTime, setInTime] = useState("");
  const [outTime, setOutTime] = useState("");
  const [status, setStatus] = useState("Present");
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);

  const BASE_URL = "https://brd-backend-o7n9.onrender.com/api";
  const token = localStorage.getItem("token");
  const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };

  // Fetch employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/employees`, axiosConfig);
        setEmployees(res.data.employees || []);
      } catch (err) {
        console.error("Error fetching employees:", err);
      }
    };
    fetchEmployees();
  }, []);

  // Fetch attendance history
  const fetchAttendance = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/attendance`, {
        ...axiosConfig,
        params: { employee_id: employeeId || undefined },
      });
      setAttendanceHistory(res.data.attendanceHistory || []);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Error fetching attendance");
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [employeeId]);

  // Mark or update attendance
  const handleMarkAttendance = async () => {
    if (!employeeId) {
      setMessage("Please select an employee");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const payload = {
        employee_id: employeeId, // ObjectId now
        attendance_date: new Date().toISOString().split("T")[0],
        in_time: inTime,
        out_time: outTime,
        status,
      };

      if (editingId) {
        await axios.put(
          `${BASE_URL}/attendance/${editingId}`,
          payload,
          axiosConfig
        );
        setMessage("Attendance updated successfully");
        setEditingId(null);
      } else {
        await axios.post(`${BASE_URL}/attendance`, payload, axiosConfig);
        setMessage("Attendance marked successfully");
      }

      setInTime("");
      setOutTime("");
      setStatus("Present");
      fetchAttendance();
    } catch (err) {
      setMessage(err.response?.data?.message || "Error marking attendance");
    } finally {
      setLoading(false);
    }
  };

  // Mark leave
  const handleMarkLeave = async () => {
    if (!employeeId) {
      setMessage("Please select an employee");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      await axios.post(
        `${BASE_URL}/attendance/leave`,
        {
          employee_id: employeeId,
          attendance_date: new Date().toISOString().split("T")[0],
        },
        axiosConfig
      );
      setMessage("Leave marked successfully");
      setStatus("On Leave");
      fetchAttendance();
    } catch (err) {
      setMessage(err.response?.data?.message || "Error marking leave");
    } finally {
      setLoading(false);
    }
  };

  // Edit attendance record
  const handleEdit = (record) => {
    setEditingId(record._id);
    setEmployeeId(record.employee_id._id || record.employee_id);
    setInTime(record.in_time || "");
    setOutTime(record.out_time || "");
    setStatus(record.status || "Present");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {editingId ? "Edit Attendance" : "Mark Attendance"}
        </h2>

        {message && (
          <p className="mb-4 text-center text-blue-600 font-medium">
            {message}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Employee Dropdown */}
          <select
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
          >
            <option value="">Select Employee</option>
            {employees.map((emp) => (
              <option key={emp._id} value={emp._id}>
                {emp.first_name} {emp.last_name} ({emp.employee_code})
              </option>
            ))}
          </select>

          {/* Attendance Status */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
          >
            <option value="Present">Present</option>
            <option value="Remote">Remote</option>
            <option value="On Leave">On Leave</option>
          </select>

          <input
            type="time"
            placeholder="In Time"
            value={inTime}
            onChange={(e) => setInTime(e.target.value)}
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
          />
          <input
            type="time"
            placeholder="Out Time"
            value={outTime}
            onChange={(e) => setOutTime(e.target.value)}
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
          />
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={handleMarkAttendance}
            disabled={loading}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded transition"
          >
            {loading
              ? "Processing..."
              : editingId
              ? "Update Attendance"
              : "Mark Attendance"}
          </button>
          <button
            onClick={handleMarkLeave}
            disabled={loading}
            className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded transition"
          >
            {loading ? "Processing..." : "Mark Leave"}
          </button>
        </div>

        {/* Attendance History Table */}
        <h3 className="text-xl font-semibold mb-4">Attendance History</h3>
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">Employee</th>
                <th className="border px-4 py-2">Date</th>
                <th className="border px-4 py-2">In Time</th>
                <th className="border px-4 py-2">Out Time</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {attendanceHistory.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    No attendance records
                  </td>
                </tr>
              ) : (
                attendanceHistory.map((item) => (
                  <tr key={item._id} className="text-center">
                    <td className="border px-4 py-2">
                      {typeof item.employee_id === "object"
                        ? `${item.employee_id.first_name} ${item.employee_id.last_name} (${item.employee_id.employee_code})`
                        : item.employee_id}
                    </td>
                    <td className="border px-4 py-2">
                      {new Date(item.attendance_date).toLocaleDateString()}
                    </td>
                    <td className="border px-4 py-2">{item.in_time || "-"}</td>
                    <td className="border px-4 py-2">{item.out_time || "-"}</td>
                    <td className="border px-4 py-2">{item.status}</td>
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded transition"
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
      </div>
    </div>
  );
}
