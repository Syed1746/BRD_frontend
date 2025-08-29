// src/layouts/DashboardLayout.jsx
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  UserCircle,
  Building2,
  FolderKanban,
  FileText,
  Clock,
} from "lucide-react";

export default function DashboardLayout() {
  const location = useLocation();

  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    { name: "Employees", path: "/employees", icon: <Users size={20} /> },
    {
      name: "Attendance",
      path: "/attendance",
      icon: <CalendarCheck size={20} />,
    },
    { name: "Customers", path: "/customers", icon: <UserCircle size={20} /> },
    { name: "Vendors", path: "/vendors", icon: <Building2 size={20} /> },
    { name: "Projects", path: "/projects", icon: <FolderKanban size={20} /> },
    { name: "Invoices", path: "/invoices", icon: <FileText size={20} /> },
    { name: "Timesheets", path: "/timesheets", icon: <Clock size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-gray-200 flex flex-col">
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-2xl font-bold text-white tracking-wide">
            Miicon Protocol
          </h2>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition 
                  ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-slate-800 hover:text-white"
                  }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer / Profile */}
        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center gap-3">
            <img
              src="https://i.pravatar.cc/40"
              alt="user"
              className="w-10 h-10 rounded-full border border-gray-500"
            />
            <div>
              <p className="font-medium text-white">John Doe</p>
              <p className="text-xs text-gray-400">Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
