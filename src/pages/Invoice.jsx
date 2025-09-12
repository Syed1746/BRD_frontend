// src/pages/Invoice.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Plus,
  Pencil,
  X,
  FileText,
  DollarSign,
  CalendarDays,
  User,
  Building2,
} from "lucide-react";

export default function Invoice() {
  const [invoices, setInvoices] = useState([]);
  const [formData, setFormData] = useState({
    customer_id: "",
    vendor_id: "",
    amount: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  const token = localStorage.getItem("token");
  const BASE_URL = "https://brd-backend-o7n9.onrender.com/api/invoices";
  const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };

  // Fetch Invoices
  const fetchInvoices = async () => {
    try {
      const res = await axios.get(BASE_URL, axiosConfig);
      setInvoices(res.data.invoices || []);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || "Failed to fetch invoices");
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Create or Update Invoice
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      if (editingId) {
        await axios.put(`${BASE_URL}/${editingId}`, formData, axiosConfig);
        setMessage("✅ Invoice updated successfully");
      } else {
        await axios.post(BASE_URL, formData, axiosConfig);
        setMessage("✅ Invoice created successfully");
      }
      setFormData({
        customer_id: "",
        vendor_id: "",
        amount: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
      });
      setEditingId(null);
      setShowModal(false);
      fetchInvoices();
    } catch (err) {
      setMessage(err.response?.data?.error || "❌ Error saving invoice");
    } finally {
      setLoading(false);
    }
  };

  // Edit existing Invoice
  const handleEdit = (invoice) => {
    setEditingId(invoice._id);
    setFormData({
      customer_id: invoice.customer_id?._id || invoice.customer_id || "",
      vendor_id: invoice.vendor_id?._id || invoice.vendor_id || "",
      amount: invoice.amount,
      description: invoice.description,
      date: invoice.date ? invoice.date.split("T")[0] : "",
    });
    setShowModal(true);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen space-y-8">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Invoices</h2>
          <button
            onClick={() => {
              setEditingId(null);
              setFormData({
                customer_id: "",
                vendor_id: "",
                amount: "",
                description: "",
                date: new Date().toISOString().split("T")[0],
              });
              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition"
          >
            <Plus size={18} /> Add Invoice
          </button>
        </div>

        {message && (
          <p className="mb-4 text-center font-medium text-blue-600">
            {message}
          </p>
        )}

        {/* Loading State */}
        {initialLoading ? (
          <div className="flex justify-center items-center py-10">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="p-3 text-left">Customer</th>
                  <th className="p-3 text-left">Vendor</th>
                  <th className="p-3 text-left">Amount</th>
                  <th className="p-3 text-left">Description</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {invoices.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-6 text-gray-500">
                      No invoices found
                    </td>
                  </tr>
                ) : (
                  invoices.map((inv) => (
                    <tr key={inv._id} className="hover:bg-gray-50 transition">
                      <td className="p-3">
                        {inv.customer_id?._id || inv.customer_id}
                      </td>
                      <td className="p-3">
                        {inv.vendor_id?._id || inv.vendor_id}
                      </td>
                      <td className="p-3 font-medium text-green-600">
                        ${inv.amount}
                      </td>
                      <td className="p-3">{inv.description}</td>
                      <td className="p-3">
                        {inv.date
                          ? new Date(inv.date).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="p-3 flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(inv)}
                          className="flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded-lg text-sm"
                        >
                          <Pencil size={14} /> Edit
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-2xl p-6 rounded-2xl shadow-lg relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-semibold mb-6 text-gray-800">
              {editingId ? "Edit Invoice" : "Create Invoice"}
            </h2>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Customer */}
              <div className="relative">
                <User
                  className="absolute left-3 top-3 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  name="customer_id"
                  value={formData.customer_id}
                  onChange={handleChange}
                  placeholder="Customer ID"
                  className="pl-10 p-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Vendor */}
              <div className="relative">
                <Building2
                  className="absolute left-3 top-3 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  name="vendor_id"
                  value={formData.vendor_id}
                  onChange={handleChange}
                  placeholder="Vendor ID"
                  className="pl-10 p-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Amount */}
              <div className="relative">
                <DollarSign
                  className="absolute left-3 top-3 text-gray-400"
                  size={18}
                />
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="Amount"
                  className="pl-10 p-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Date */}
              <div className="relative">
                <CalendarDays
                  className="absolute left-3 top-3 text-gray-400"
                  size={18}
                />
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="pl-10 p-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Description */}
              <div className="relative md:col-span-2">
                <FileText
                  className="absolute left-3 top-3 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Description"
                  className="pl-10 p-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="col-span-1 md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg shadow-md font-medium transition"
              >
                {loading
                  ? "Saving..."
                  : editingId
                  ? "Update Invoice"
                  : "Create Invoice"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
