// src/pages/EmployeeDashboard.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import {
  CalendarCheck,
  FolderKanban,
  Clock,
  Bell,
  UserCheck,
} from "lucide-react";

export default function EmployeeDashboard() {
  const [stats, setStats] = useState({
    tasksCompleted: 0,
    projects: 0,
    attendanceToday: "Loading...",
    hoursWorked: "0h 0m",
  });
  const [tasks, setTasks] = useState([]);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [user, setUser] = useState(null);

  const BASE_URL = "http://localhost:5000/api";
  const token = localStorage.getItem("token");
  const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    // Load user info
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        // Fetch attendance history
        const attendanceRes = await axios.get(
          `${BASE_URL}/attendance`,
          axiosConfig
        );
        const allAttendance = attendanceRes.data.attendanceHistory || [];

        const today = new Date().toISOString().split("T")[0];
        const todaysAttendance = allAttendance.find(
          (record) =>
            (typeof record.employee_id === "object"
              ? record.employee_id._id
              : record.employee_id) === (user.employee_id || user.id) &&
            record.attendance_date.startsWith(today)
        );

        setAttendanceHistory(
          allAttendance.filter(
            (record) =>
              (typeof record.employee_id === "object"
                ? record.employee_id._id
                : record.employee_id) === (user.employee_id || user.id)
          )
        );

        setStats((prev) => ({
          ...prev,
          attendanceToday: todaysAttendance?.status || "Absent",
          hoursWorked: todaysAttendance
            ? `${todaysAttendance.hours_worked || "--:--"}`
            : "0h 0m",
        }));

        // Simulate fetching tasks and projects
        setTasks([
          { id: 1, name: "Design homepage UI", status: "In Progress" },
          { id: 2, name: "Fix login bug", status: "Pending" },
          { id: 3, name: "Update timesheet", status: "Completed" },
        ]);

        setStats((prev) => ({
          ...prev,
          tasksCompleted: 1, // Simulated
          projects: 2, // Simulated
        }));
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [user]);

  if (!user)
    return (
      <p className="text-center mt-20 text-gray-600">Loading user info...</p>
    );

  return (
    <div className="p-6 space-y-8">
      {/* Greeting */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome Back, {user?.name || "Employee"}!
        </h1>
        <p className="text-gray-600">Here's your summary for today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Tasks Completed",
            value: stats.tasksCompleted,
            icon: <Clock className="w-6 h-6 text-blue-600" />,
            color: "bg-blue-50 text-blue-700",
          },
          {
            label: "Projects",
            value: stats.projects,
            icon: <FolderKanban className="w-6 h-6 text-green-600" />,
            color: "bg-green-50 text-green-700",
          },
          {
            label: "Attendance Today",
            value: stats.attendanceToday,
            icon: <UserCheck className="w-6 h-6 text-pink-600" />,
            color: "bg-pink-50 text-pink-700",
          },
          {
            label: "Hours Worked",
            value: stats.hoursWorked,
            icon: <Clock className="w-6 h-6 text-purple-600" />,
            color: "bg-purple-50 text-purple-700",
          },
        ].map((card, idx) => (
          <div
            key={idx}
            className={`flex items-center justify-between p-6 rounded-xl shadow-sm border ${card.color} hover:shadow-lg transition`}
          >
            <div>
              <h2 className="text-2xl font-bold">{card.value}</h2>
              <p className="text-sm">{card.label}</p>
            </div>
            <div className="p-3 bg-white rounded-lg shadow-inner">
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Tasks Table */}
      <div className="bg-white rounded-xl shadow-sm p-6 border">
        <h2 className="text-lg font-semibold mb-4">Your Tasks</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600">
                <th className="p-3 font-medium text-left">Task</th>
                <th className="p-3 font-medium text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50 transition">
                  <td className="p-3 font-medium text-gray-800">{task.name}</td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        task.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : task.status === "In Progress"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {task.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Attendance History Mini Table */}
      <div className="bg-white rounded-xl shadow-sm p-6 border">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <CalendarCheck className="w-5 h-5 text-blue-500" /> Attendance History
        </h2>
        {attendanceHistory.length === 0 ? (
          <p className="text-gray-500">No attendance records yet.</p>
        ) : (
          <ul className="space-y-2">
            {attendanceHistory.slice(-5).map((record) => (
              <li
                key={record._id}
                className="flex justify-between bg-gray-50 p-2 rounded-md"
              >
                <span>
                  {new Date(record.attendance_date).toLocaleDateString()}
                </span>
                <span>{record.status}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
