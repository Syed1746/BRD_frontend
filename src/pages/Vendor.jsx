// src/pages/Vendor.jsx
import { useState, useEffect } from "react";
import axios from "axios";

export default function Vendor() {
  const [vendors, setVendors] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
  });
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  // ✅ Get token from localStorage
  const token = localStorage.getItem("token");

  // ✅ Create axios config with headers
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchVendors = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/vendor",
        axiosConfig
      );
      setVendors(res.data.vendors);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Failed to fetch vendors");
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      if (editingId) {
        await axios.put(
          `http://localhost:3000/api/vendor/${editingId}`,
          formData,
          axiosConfig
        );
        setMessage("Vendor updated successfully");
        setEditingId(null);
      } else {
        await axios.post(
          "http://localhost:3000/api/vendor",
          formData,
          axiosConfig
        );
        setMessage("Vendor added successfully");
      }
      setFormData({ name: "", email: "", phone: "", company: "" });
      fetchVendors();
    } catch (err) {
      setMessage(err.response?.data?.message || "Error saving vendor");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (vendor) => {
    setEditingId(vendor._id);
    setFormData({
      name: vendor.name,
      email: vendor.email,
      phone: vendor.phone,
      company: vendor.company,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeactivate = async (id) => {
    if (!window.confirm("Are you sure you want to deactivate this vendor?"))
      return;
    try {
      await axios.patch(
        `http://localhost:3000/api/vendor/${id}/deactivate`,
        {},
        axiosConfig
      );
      setMessage("Vendor deactivated successfully");
      fetchVendors();
    } catch (err) {
      setMessage(err.response?.data?.message || "Error deactivating vendor");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {editingId ? "Edit Vendor" : "Add Vendor"}
        </h2>

        {message && (
          <p className="mb-4 text-center text-blue-600 font-medium">
            {message}
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
        >
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
            required
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
            required
          />
          <input
            type="text"
            placeholder="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
            required
          />
          <input
            type="text"
            placeholder="Company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
          />

          <button
            type="submit"
            className="col-span-1 md:col-span-4 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded transition"
            disabled={loading}
          >
            {loading ? "Saving..." : editingId ? "Update Vendor" : "Add Vendor"}
          </button>
        </form>

        <h3 className="text-xl font-semibold mb-4">Vendor List</h3>
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">Phone</th>
                <th className="border px-4 py-2">Company</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vendors.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    No vendors found
                  </td>
                </tr>
              )}
              {vendors.map((v) => (
                <tr key={v._id} className="text-center">
                  <td className="border px-4 py-2">{v.name}</td>
                  <td className="border px-4 py-2">{v.email}</td>
                  <td className="border px-4 py-2">{v.phone}</td>
                  <td className="border px-4 py-2">{v.company}</td>
                  <td className="border px-4 py-2">{v.status || "Active"}</td>
                  <td className="border px-4 py-2 flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(v)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeactivate(v._id)}
                      className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded transition"
                    >
                      Deactivate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
