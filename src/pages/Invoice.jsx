// src/pages/Invoice.jsx
import { useState, useEffect } from "react";
import axios from "axios";

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
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const fetchInvoices = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/invoice");
      setInvoices(res.data.invoices);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchInvoices();
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
          `http://localhost:3000/api/invoice/${editingId}`,
          formData
        );
        setMessage("Invoice updated successfully");
        setEditingId(null);
      } else {
        await axios.post("http://localhost:3000/api/invoice", formData);
        setMessage("Invoice created successfully");
      }
      setFormData({
        customer_id: "",
        vendor_id: "",
        amount: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
      });
      fetchInvoices();
    } catch (err) {
      setMessage(err.response?.data?.error || "Error saving invoice");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (invoice) => {
    setEditingId(invoice._id);
    setFormData({
      customer_id: invoice.customer_id?._id || "",
      vendor_id: invoice.vendor_id?._id || "",
      amount: invoice.amount,
      description: invoice.description,
      date: invoice.date ? invoice.date.split("T")[0] : "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {editingId ? "Edit Invoice" : "Create Invoice"}
        </h2>

        {message && (
          <p className="mb-4 text-center text-blue-600 font-medium">
            {message}
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
        >
          <input
            type="text"
            name="customer_id"
            placeholder="Customer ID"
            value={formData.customer_id}
            onChange={handleChange}
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
            required
          />
          <input
            type="text"
            name="vendor_id"
            placeholder="Vendor ID"
            value={formData.vendor_id}
            onChange={handleChange}
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
          />
          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={formData.amount}
            onChange={handleChange}
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
            required
          />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 col-span-1 md:col-span-2 w-full"
          />
          <button
            type="submit"
            className="col-span-1 md:col-span-3 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded transition"
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : editingId
              ? "Update Invoice"
              : "Create Invoice"}
          </button>
        </form>

        <h3 className="text-xl font-semibold mb-4">Invoices</h3>
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">Customer ID</th>
                <th className="border px-4 py-2">Vendor ID</th>
                <th className="border px-4 py-2">Amount</th>
                <th className="border px-4 py-2">Description</th>
                <th className="border px-4 py-2">Date</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    No invoices found
                  </td>
                </tr>
              )}
              {invoices.map((inv) => (
                <tr key={inv._id} className="text-center">
                  <td className="border px-4 py-2">
                    {inv.customer_id?._id || inv.customer_id}
                  </td>
                  <td className="border px-4 py-2">
                    {inv.vendor_id?._id || inv.vendor_id}
                  </td>
                  <td className="border px-4 py-2">{inv.amount}</td>
                  <td className="border px-4 py-2">{inv.description}</td>
                  <td className="border px-4 py-2">
                    {inv.date ? new Date(inv.date).toLocaleDateString() : "-"}
                  </td>
                  <td className="border px-4 py-2 flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(inv)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded transition"
                    >
                      Edit
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
