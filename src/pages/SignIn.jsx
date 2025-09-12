// src/pages/SignIn.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../config";
import { Loader2 } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SignIn({ onLogin }) {
  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(`${BASE_URL}/api/auth/login`, formData);

      if (res.status === 200) {
        const { token, role, id, employee_id, name } = res.data;

        // Save in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        localStorage.setItem(
          "user",
          JSON.stringify({ id, employee_id, name: name || "John Doe", role })
        );

        // Notify App.jsx about login
        onLogin(role, token);

        toast.success("🎉 Login Successful! Redirecting...", {
          position: "top-right",
          autoClose: 1500,
          theme: "colored",
        });

        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
      toast.error("❌ Login Failed! Please check credentials.", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex min-h-screen">
        {/* Left Side */}
        <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white flex-col justify-center items-center p-12 relative">
          <h1 className="text-5xl font-extrabold mb-6 animate-fade-in">
            Welcome Back 👋
          </h1>
          <p className="text-lg text-center max-w-md opacity-90">
            Manage your projects, track timesheets, and collaborate effortlessly
            with your team. Let’s get productive today.
          </p>
          <div className="absolute bottom-10 text-sm opacity-70">
            © {new Date().getFullYear()} BRD Management
          </div>
        </div>

        {/* Right Side (Form) */}
        <div className="flex w-full lg:w-1/2 justify-center items-center bg-gray-50">
          <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md animate-slide-up">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
              Sign In to Your Account
            </h2>

            {error && (
              <p className="text-red-500 mb-4 text-center font-medium">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <input
                type="text"
                name="usernameOrEmail"
                placeholder="Username or Email"
                value={formData.usernameOrEmail}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-200 transition"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-200 transition"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 font-semibold flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>

            <p className="text-sm text-center mt-6 text-gray-600">
              Don’t have an account?{" "}
              <span
                onClick={() => navigate("/signup")}
                className="text-blue-500 cursor-pointer hover:underline font-medium"
              >
                Sign Up
              </span>
            </p>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
