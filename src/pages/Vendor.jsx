// src/pages/Vendor.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Building2,
  Mail,
  Phone,
  Hash,
  Plus,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

export default function Vendor() {
  const [vendors, setVendors] = useState([]);
  const [formData, setFormData] = useState({
    vendor_code: "",
    vendor_name: "",
    email: "",
    phone_number: "",
  });
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  const token = localStorage.getItem("token");
  const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };
  const BASE_URL = "https://brd-backend-o7n9.onrender.com";

  // Fetch vendors
  const fetchVendors = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/vendors`, axiosConfig);
      setVendors(res.data.vendors || []);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Failed to fetch vendors");
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      if (editingId) {
        await axios.put(
          `${BASE_URL}/api/vendors/${editingId}`,
          formData,
          axiosConfig
        );
        setMessage("✅ Vendor updated successfully");
      } else {
        await axios.post(`${BASE_URL}/api/vendors`, formData, axiosConfig);
        setMessage("✅ Vendor added successfully");
      }
      setFormData({
        vendor_code: "",
        vendor_name: "",
        email: "",
        phone_number: "",
      });
      setEditingId(null);
      setShowModal(false);
      fetchVendors();
    } catch (err) {
      setMessage(err.response?.data?.error || "❌ Error saving vendor");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (vendor) => {
    setEditingId(vendor._id);
    setFormData({
      vendor_code: vendor.vendor_code,
      vendor_name: vendor.vendor_name,
      email: vendor.email,
      phone_number: vendor.phone_number,
    });
    setShowModal(true);
  };

  const handleDeactivate = async (id) => {
    if (!window.confirm("Are you sure you want to deactivate this vendor?"))
      return;
    try {
      await axios.patch(
        `${BASE_URL}/api/vendors/${id}/deactivate`,
        {},
        axiosConfig
      );
      setMessage("⚠️ Vendor deactivated successfully");
      fetchVendors();
    } catch (err) {
      setMessage(err.response?.data?.error || "❌ Error deactivating vendor");
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen space-y-8">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Vendors</h2>
          <button
            onClick={() => {
              setEditingId(null);
              setFormData({
                vendor_code: "",
                vendor_name: "",
                email: "",
                phone_number: "",
              });
              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition"
          >
            <Plus size={18} /> Add Vendor
          </button>
        </div>

        {message && (
          <p className="mb-4 text-center font-medium text-blue-600">
            {message}
          </p>
        )}

        {/* Vendor Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-3 text-left">Vendor Code</th>
                <th className="p-3 text-left">Vendor Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {vendors.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500">
                    No vendors found
                  </td>
                </tr>
              ) : (
                vendors.map((v) => (
                  <tr key={v._id} className="hover:bg-gray-50 transition">
                    <td className="p-3">{v.vendor_code}</td>
                    <td className="p-3 font-medium">{v.vendor_name}</td>
                    <td className="p-3">{v.email}</td>
                    <td className="p-3">{v.phone_number}</td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          v.status === "Inactive"
                            ? "bg-red-100 text-red-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {v.status || "Active"}
                      </span>
                    </td>
                    <td className="p-3 flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(v)}
                        className="flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded-lg text-sm"
                      >
                        <Pencil size={14} /> Edit
                      </button>
                      <button
                        onClick={() => handleDeactivate(v._id)}
                        className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-lg text-sm"
                      >
                        <Trash2 size={14} /> Deactivate
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg p-6 rounded-2xl shadow-lg relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-semibold mb-6 text-gray-800">
              {editingId ? "Edit Vendor" : "Add Vendor"}
            </h2>

            <form onSubmit={handleSubmit} className="grid gap-4">
              {/* Vendor Code */}
              <div className="relative">
                <Hash
                  className="absolute left-3 top-3 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  name="vendor_code"
                  value={formData.vendor_code}
                  onChange={handleChange}
                  placeholder="Vendor Code"
                  className="pl-10 p-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Vendor Name */}
              <div className="relative">
                <Building2
                  className="absolute left-3 top-3 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  name="vendor_name"
                  value={formData.vendor_name}
                  onChange={handleChange}
                  placeholder="Vendor Name"
                  className="pl-10 p-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Email */}
              <div className="relative">
                <Mail
                  className="absolute left-3 top-3 text-gray-400"
                  size={18}
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="pl-10 p-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Phone */}
              <div className="relative">
                <Phone
                  className="absolute left-3 top-3 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className="pl-10 p-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg shadow-md font-medium transition"
              >
                {loading
                  ? "Saving..."
                  : editingId
                  ? "Update Vendor"
                  : "Add Vendor"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
