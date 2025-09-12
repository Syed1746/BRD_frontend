// src/pages/SignUp.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "Employee",
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
      const res = await axios.post(
        "https://brd-backend-o7n9.onrender.com/api/auth/signup",
        formData
      );

      if (res.status === 201) {
        toast.success("🎉 Signup Successful! Redirecting to Sign In...", {
          position: "top-right",
          autoClose: 2500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          theme: "colored",
        });

        setTimeout(() => navigate("/signin"), 2500);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");

      toast.error("❌ Signup Failed! Please try again.", {
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
        {/* Left Side with Gradient & Illustration */}
        <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white flex-col justify-center items-center p-12 relative">
          <h1 className="text-5xl font-extrabold mb-6 animate-fade-in">
            Create Your Account 🚀
          </h1>
          <p className="text-lg text-center max-w-md opacity-90">
            Join BRD Management and simplify your workflow. Collaborate, track,
            and grow together with your team.
          </p>
          <div className="absolute bottom-10 text-sm opacity-70">
            © {new Date().getFullYear()} BRD Management
          </div>
        </div>

        {/* Right Side Form */}
        <div className="flex w-full lg:w-1/2 justify-center items-center bg-gray-50">
          <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md animate-slide-up">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
              Sign Up
            </h2>

            {error && (
              <p className="text-red-500 mb-4 text-center font-medium">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <input
                type="text"
                name="username"
                placeholder="Full Name"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-4 focus:ring-indigo-200 transition"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-4 focus:ring-indigo-200 transition"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-4 focus:ring-indigo-200 transition"
                required
              />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-4 focus:ring-indigo-200 transition bg-white"
                required
              >
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Employee">Employee</option>
              </select>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 font-semibold flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                {loading ? "Signing Up..." : "Sign Up"}
              </button>
            </form>

            <p className="text-sm text-center mt-6 text-gray-600">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/signin")}
                className="text-indigo-500 cursor-pointer hover:underline font-medium"
              >
                Sign In
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Toast container for notifications */}
      <ToastContainer />
    </>
  );
}
