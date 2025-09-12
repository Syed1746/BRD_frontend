// src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import {
  Users,
  UserCheck,
  ClipboardList,
  CalendarCheck,
  Bell,
  Award,
} from "lucide-react";

export default function Dashboard() {
  // State for real-time stats
  const [stats, setStats] = useState({
    totalEmployees: 2300,
    activeEmployees: 1081,
    tasks: 34,
    attendance: 91,
  });

  const [attendance] = useState([
    {
      employee: "Syed Mahamud Hasan",
      checkIn: "09:36",
      checkOut: "18:55",
      workingHrs: "09h 02m",
      status: "Late",
    },
    {
      employee: "Kamrul Hasan",
      checkIn: "09:30",
      checkOut: "18:30",
      workingHrs: "09h 00m",
      status: "On Time",
    },
  ]);

  const [notices] = useState([
    { id: 1, text: "Get ready for meeting at 6 pm", date: "22-Aug-24" },
    { id: 2, text: "Management Decision", date: "11-Jul-24" },
    {
      id: 3,
      text: "Our Organization will Organize an Annual Report",
      date: "10-Jul-24",
    },
  ]);

  const [awards] = useState([
    {
      id: 1,
      name: "Honorato Imogene Curry",
      dept: "Electrical",
      award: "Gas Capitol",
      date: "22-Aug-24",
    },
    {
      id: 2,
      name: "Jonathan Ibrahim Sheikh",
      dept: "Production",
      award: "Coby Beach",
      date: "30-Nov-24",
    },
    {
      id: 3,
      name: "Maisha Lucy Zamora Gon",
      dept: "Software",
      award: "Best Employee",
      date: "22-Aug-24",
    },
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        activeEmployees:
          prev.activeEmployees + Math.floor(Math.random() * 2 - 1),
        tasks: Math.max(0, prev.tasks + Math.floor(Math.random() * 2 - 1)),
        attendance: prev.attendance + Math.floor(Math.random() * 2 - 1),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen space-y-8">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            label: "Total Employees",
            value: stats.totalEmployees,
            icon: <Users className="w-8 h-8 text-blue-600" />,
            color: "bg-blue-50 text-blue-700",
          },
          {
            label: "Active Employees",
            value: stats.activeEmployees,
            icon: <UserCheck className="w-8 h-8 text-green-600" />,
            color: "bg-green-50 text-green-700",
          },
          {
            label: "Tasks",
            value: stats.tasks,
            icon: <ClipboardList className="w-8 h-8 text-purple-600" />,
            color: "bg-purple-50 text-purple-700",
          },
          {
            label: "Attendance",
            value: stats.attendance,
            icon: <CalendarCheck className="w-8 h-8 text-pink-600" />,
            color: "bg-pink-50 text-pink-700",
          },
        ].map((card, idx) => (
          <div
            key={idx}
            className={`flex items-center justify-between p-6 rounded-xl shadow-sm border ${card.color} hover:shadow-md transition`}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Table */}
        <div className="bg-white rounded-xl shadow-sm p-6 border lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Attendance</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600">
                  <th className="p-3 font-medium text-left">Employee</th>
                  <th className="p-3 font-medium text-left">Check In</th>
                  <th className="p-3 font-medium text-left">Check Out</th>
                  <th className="p-3 font-medium text-left">Working Hrs</th>
                  <th className="p-3 font-medium text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {attendance.map((att, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition">
                    <td className="p-3 font-medium text-gray-800">
                      {att.employee}
                    </td>
                    <td className="p-3">{att.checkIn}</td>
                    <td className="p-3">{att.checkOut}</td>
                    <td className="p-3">{att.workingHrs}</td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          att.status === "On Time"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {att.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Notice Board */}
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-500" /> Notice Board
          </h2>
          <ul className="space-y-3">
            {notices.map((n) => (
              <li
                key={n.id}
                className="flex justify-between items-center p-2 bg-gray-50 rounded-md hover:bg-gray-100"
              >
                <span className="text-gray-700 text-sm">{n.text}</span>
                <span className="text-xs text-gray-500">{n.date}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Employee Awards */}
      <div className="bg-white rounded-xl shadow-sm p-6 border">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-yellow-500" /> Employee Awards
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600">
                <th className="p-3 font-medium text-left">Name</th>
                <th className="p-3 font-medium text-left">Department</th>
                <th className="p-3 font-medium text-left">Award</th>
                <th className="p-3 font-medium text-left">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {awards.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50 transition">
                  <td className="p-3 font-medium text-gray-800">{a.name}</td>
                  <td className="p-3">{a.dept}</td>
                  <td className="p-3">{a.award}</td>
                  <td className="p-3 text-gray-500">{a.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
