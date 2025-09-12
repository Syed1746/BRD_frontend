// src/pages/DashboardLayout.jsx
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
  Bell,
  Search,
} from "lucide-react";

export default function DashboardLayout() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    setRole(storedRole);
    setUser(storedUser);
  }, []);

  if (!role || !user) return null;

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
        className="fixed top-0 left-0 h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-gray-200 flex flex-col shadow-xl z-30 border-r border-slate-700"
      >
        {/* Logo + Toggle */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <AnimatePresence>
            {!collapsed && (
              <motion.h2
                key="logo"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="text-lg font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent tracking-wide"
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
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300
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
        <div className="p-4 border-t border-slate-700">
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
                  <p className="font-semibold text-white truncate">
                    {user?.name || "User"}
                  </p>
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
      <main
        className={`flex-1 flex flex-col transition-all duration-300 ${
          collapsed ? "ml-[80px]" : "ml-[260px]"
        }`}
      >
        {/* Header */}
        <header className="sticky top-0 z-20 bg-white/70 backdrop-blur-xl shadow-md px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">
            {navItems.find((item) => location.pathname.startsWith(item.path))
              ?.name || "Dashboard"}
          </h1>

          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
              />
              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={18}
              />
            </div>

            <button className="p-2 rounded-full hover:bg-gray-100 transition relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            <img
              src="https://i.pravatar.cc/50"
              alt="profile"
              className="w-9 h-9 rounded-full border-2 border-blue-500 shadow"
            />
          </div>
        </header>

        {/* Page Content */}
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.25 }}
          className="flex-1 p-6 overflow-y-auto bg-gray-50"
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
}
