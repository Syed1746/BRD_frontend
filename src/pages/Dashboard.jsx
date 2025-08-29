// src/pages/Dashboard.jsx
import { Users, UserCheck, ClipboardList, CalendarCheck } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="space-y-8 p-6">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="flex items-center gap-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow hover:scale-105 transition">
          <Users className="w-10 h-10" />
          <div>
            <p className="text-sm opacity-80">Active Employees</p>
            <h2 className="text-2xl font-bold">1081</h2>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-2xl shadow hover:scale-105 transition">
          <UserCheck className="w-10 h-10" />
          <div>
            <p className="text-sm opacity-80">Total Employees</p>
            <h2 className="text-2xl font-bold">2300</h2>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-2xl shadow hover:scale-105 transition">
          <ClipboardList className="w-10 h-10" />
          <div>
            <p className="text-sm opacity-80">Tasks</p>
            <h2 className="text-2xl font-bold">34</h2>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white p-6 rounded-2xl shadow hover:scale-105 transition">
          <CalendarCheck className="w-10 h-10" />
          <div>
            <p className="text-sm opacity-80">Attendance</p>
            <h2 className="text-2xl font-bold">+91</h2>
          </div>
        </div>
      </div>

      {/* Departments */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Departments</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {["Engineering & Dev", "Marketing & Sales", "Finance", "HR"].map(
            (dept, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl shadow hover:shadow-lg hover:scale-105 transition cursor-pointer text-center font-medium"
              >
                {dept}
              </div>
            )
          )}
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Attendance</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-50 sticky top-0">
              <tr className="text-left text-gray-600">
                <th className="p-3 font-medium">Employee</th>
                <th className="p-3 font-medium">Check In</th>
                <th className="p-3 font-medium">Check Out</th>
                <th className="p-3 font-medium">Working Hrs</th>
                <th className="p-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className="hover:bg-gray-50 transition">
                <td className="p-3 font-medium text-gray-800">
                  Syed Mahamud Hasan
                </td>
                <td className="p-3">09:36</td>
                <td className="p-3">18:55</td>
                <td className="p-3">09h 02m</td>
                <td className="p-3">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
                    Late
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-gray-50 transition">
                <td className="p-3 font-medium text-gray-800">Kamrul Hasan</td>
                <td className="p-3">09:30</td>
                <td className="p-3">18:30</td>
                <td className="p-3">09h 00m</td>
                <td className="p-3">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
                    On Time
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
