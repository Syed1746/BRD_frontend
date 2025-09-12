import { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import axios from "axios";
import { Plus, X, Clock, UserCheck, Laptop, Coffee } from "lucide-react";

export default function Attendance() {
  const [user, setUser] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);

  const [employeeId, setEmployeeId] = useState("");
  const [inTime, setInTime] = useState("");
  const [outTime, setOutTime] = useState("");
  const [status, setStatus] = useState("Present");
  const [editingId, setEditingId] = useState(null);

  const BASE_URL = "https://brd-backend-o7n9.onrender.com/api";
  const token = localStorage.getItem("token");
  const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const isAdminOrManager = user?.role === "Admin" || user?.role === "Manager";
  const loggedInEmployeeId = user?.employee_id || user?.id;

  // Fetch employees for Admin/Manager
  useEffect(() => {
    if (!isAdminOrManager) return;
    const fetchEmployees = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/employees`, axiosConfig);
        setEmployees(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEmployees();
  }, [isAdminOrManager]);

  // Fetch attendance history
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/attendance`, axiosConfig);
        setAttendanceHistory(res.data.attendanceHistory || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAttendance();
  }, []);

  const openModal = (record = null) => {
    if (record) {
      setEditingId(record._id);
      setEmployeeId(record.employee_id._id || record.employee_id);
      setInTime(record.in_time || "");
      setOutTime(record.out_time || "");
      setStatus(record.status || "Present");
    } else {
      setEditingId(null);
      setEmployeeId(loggedInEmployeeId);
      setInTime("");
      setOutTime("");
      setStatus("Present");
    }
    setMessage("");
    setOpen(true);
  };

  const handleSubmit = async () => {
    if (!employeeId) {
      setMessage("Employee ID not found.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        employee_id: employeeId,
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
      } else {
        await axios.post(`${BASE_URL}/attendance`, payload, axiosConfig);
        setMessage("Attendance marked successfully");
      }

      setOpen(false);
      // Refresh attendance
      const res = await axios.get(`${BASE_URL}/attendance`, axiosConfig);
      setAttendanceHistory(res.data.attendanceHistory || []);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error submitting attendance");
    } finally {
      setLoading(false);
    }
  };

  const statusBadge = (status) => {
    switch (status) {
      case "Present":
        return (
          <span className="flex items-center gap-1 bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-medium">
            <UserCheck size={14} /> Present
          </span>
        );
      case "Remote":
        return (
          <span className="flex items-center gap-1 bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-medium">
            <Laptop size={14} /> Remote
          </span>
        );
      case "On Leave":
        return (
          <span className="flex items-center gap-1 bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full text-xs font-medium">
            <Coffee size={14} /> On Leave
          </span>
        );
      default:
        return status;
    }
  };

  if (!user)
    return (
      <p className="text-center mt-20 text-gray-600">Loading user info...</p>
    );

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-extrabold text-gray-800">Attendance</h2>
        {isAdminOrManager && (
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 shadow-md transition-transform transform hover:scale-105"
          >
            <Plus className="w-5 h-5" /> Add Attendance
          </button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {attendanceHistory.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 py-10 bg-white rounded-xl shadow">
            No attendance records found.
          </div>
        ) : (
          attendanceHistory.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition relative"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">
                    {typeof item.employee_id === "object"
                      ? `${item.employee_id.first_name} ${item.employee_id.last_name}`
                      : item.employee_id}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {typeof item.employee_id === "object" &&
                      `(${item.employee_id.employee_code})`}
                  </p>
                </div>
                {isAdminOrManager && (
                  <button
                    onClick={() => openModal(item)}
                    className="text-yellow-600 hover:bg-yellow-100 p-2 rounded-full transition"
                  >
                    Edit
                  </button>
                )}
              </div>

              <div className="mt-4 space-y-2">
                <p className="text-sm flex items-center gap-2 text-gray-600">
                  <Clock size={16} className="text-gray-400" />{" "}
                  {new Date(item.attendance_date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  In:{" "}
                  <span className="font-medium">{item.in_time || "--:--"}</span>{" "}
                  | Out:{" "}
                  <span className="font-medium">
                    {item.out_time || "--:--"}
                  </span>
                </p>
                {statusBadge(item.status)}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      <Transition appear show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setOpen(false)}
        >
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
              <Dialog.Panel className="bg-white rounded-2xl shadow-2xl w-full max-w-xl p-8 relative">
                <div className="flex justify-between items-center border-b pb-4 mb-6">
                  <Dialog.Title className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    {editingId ? "Edit Attendance" : "Mark Attendance"}
                  </Dialog.Title>
                  <button
                    onClick={() => setOpen(false)}
                    className="p-2 rounded-full hover:bg-gray-100 transition"
                  >
                    <X size={22} className="text-gray-500" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {isAdminOrManager && (
                    <div className="flex flex-col">
                      <label className="text-gray-600 mb-1 font-medium">
                        Employee
                      </label>
                      <select
                        value={employeeId}
                        onChange={(e) => setEmployeeId(e.target.value)}
                        className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                      >
                        <option value="">Select Employee</option>
                        {employees.map((emp) => (
                          <option key={emp._id} value={emp._id}>
                            {emp.first_name} {emp.last_name} (
                            {emp.employee_code})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="flex flex-col">
                    <label className="text-gray-600 mb-1 font-medium">
                      Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    >
                      <option value="Present">Present</option>
                      <option value="Remote">Remote</option>
                      <option value="On Leave">On Leave</option>
                    </select>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-gray-600 mb-1 font-medium">
                      In Time
                    </label>
                    <input
                      type="time"
                      value={inTime}
                      onChange={(e) => setInTime(e.target.value)}
                      className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-gray-600 mb-1 font-medium">
                      Out Time
                    </label>
                    <input
                      type="time"
                      value={outTime}
                      onChange={(e) => setOutTime(e.target.value)}
                      className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    />
                  </div>
                </div>

                {message && <p className="text-red-500 mt-3">{message}</p>}

                <div className="flex justify-end mt-6 gap-3">
                  <button
                    onClick={() => setOpen(false)}
                    className="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-lg transition transform hover:scale-105"
                  >
                    {loading
                      ? "Processing..."
                      : editingId
                      ? "Update"
                      : "Mark Attendance"}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
