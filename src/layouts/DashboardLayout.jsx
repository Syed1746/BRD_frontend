import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  UserCircle,
  Building2,
  FolderKanban,
  FileText,
  Clock,
  LogOut,
  Settings,
  Menu,
  ChevronLeft,
} from "lucide-react";

export default function DashboardLayout() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [role, setRole] = useState(null);

  // Update role from localStorage on mount
  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, []);

  // Show nothing until role is loaded
  if (!role) return null;

  // Role-based nav items
  const navItems =
    role === "Employee"
      ? [
          { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
          { name: "Attendance", path: "/attendance", icon: CalendarCheck },
          { name: "Projects", path: "/projects", icon: FolderKanban },
          { name: "Timesheets", path: "/timesheets", icon: Clock },
        ]
      : [
          { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
          { name: "Employees", path: "/employees", icon: Users },
          { name: "Attendance", path: "/attendance", icon: CalendarCheck },
          { name: "Customers", path: "/customers", icon: UserCircle },
          { name: "Vendors", path: "/vendors", icon: Building2 },
          { name: "Projects", path: "/projects", icon: FolderKanban },
          { name: "Invoices", path: "/invoices", icon: FileText },
          { name: "Timesheets", path: "/timesheets", icon: Clock },
        ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 80 : 260 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-gray-200 flex flex-col shadow-xl relative z-10"
      >
        {/* Logo + Toggle */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700 overflow-hidden">
          <AnimatePresence>
            {!collapsed && (
              <motion.h2
                key="logo"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="text-lg font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent tracking-wide whitespace-nowrap"
              >
                Miicon Protocol
              </motion.h2>
            )}
          </AnimatePresence>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-slate-800 text-gray-300 hover:text-white transition ml-auto"
          >
            {collapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 p-4 space-y-2 overflow-hidden">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                  ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "text-gray-300 hover:bg-slate-800 hover:text-white"
                  }`}
              >
                <Icon size={20} />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      key={item.name}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -15 }}
                      transition={{ duration: 0.2 }}
                      className="whitespace-nowrap"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </nav>

        {/* Profile Footer */}
        <div className="p-4 border-t border-slate-700 overflow-hidden">
          <div className="flex items-center gap-3">
            <img
              src="https://i.pravatar.cc/100"
              alt="user"
              className="w-10 h-10 rounded-full border-2 border-blue-500 shadow"
            />
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 overflow-hidden"
                >
                  <p className="font-semibold text-white truncate">John Doe</p>
                  <p className="text-xs text-gray-400 truncate">{role}</p>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="flex gap-2">
              <button className="p-2 rounded-lg hover:bg-slate-800 text-gray-300 hover:text-white transition">
                <Settings size={18} />
              </button>
              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.href = "/";
                }}
                className="p-2 rounded-lg hover:bg-slate-800 text-red-400 transition"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md shadow-sm px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">
            {navItems.find((item) => location.pathname.startsWith(item.path))
              ?.name || "Dashboard"}
          </h1>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
