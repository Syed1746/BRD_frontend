// src/pages/Customer.jsx
import { useState, useEffect } from "react";
import axios from "axios";

export default function Customer() {
  const [customers, setCustomers] = useState([]); // ✅ always an array
  const [formData, setFormData] = useState({
    customer_code: "",
    customer_name: "",
    email: "",
    phone_number: "",
  });
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // ✅ Correct backend URL
  const BASE_URL = "https://brd-backend-o7n9.onrender.com";

  const fetchCustomers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/customers`, config);
      // ✅ ensure fallback array
      setCustomers(res.data.customers || []);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error fetching customers");
      setCustomers([]); // ✅ prevent undefined
    }
  };

  useEffect(() => {
    fetchCustomers();
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
          `${BASE_URL}/api/customer/${editingId}`,
          formData,
          config
        );
        setMessage("Customer updated successfully");
        setEditingId(null);
      } else {
        await axios.post(`${BASE_URL}/api/customer`, formData, config);
        setMessage("Customer added successfully");
      }
      setFormData({
        customer_code: "",
        customer_name: "",
        email: "",
        phone_number: "",
      });
      fetchCustomers();
    } catch (err) {
      setMessage(err.response?.data?.error || "Error saving customer");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (customer) => {
    setEditingId(customer._id);
    setFormData({
      customer_code: customer.customer_code || "",
      customer_name: customer.customer_name,
      email: customer.email,
      phone_number: customer.phone_number,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeactivate = async (id) => {
    if (!window.confirm("Are you sure you want to deactivate this customer?"))
      return;
    try {
      await axios.put(`${BASE_URL}/api/customer/${id}/deactivate`, {}, config);
      setMessage("Customer deactivated");
      fetchCustomers();
    } catch (err) {
      setMessage(err.response?.data?.error || "Error deactivating customer");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {editingId ? "Edit Customer" : "Add Customer"}
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
            placeholder="Customer Code"
            name="customer_code"
            value={formData.customer_code}
            onChange={handleChange}
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
            required
          />
          <input
            type="text"
            placeholder="Customer Name"
            name="customer_name"
            value={formData.customer_name}
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
            placeholder="Phone Number"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
            required
          />
          <button
            type="submit"
            className="col-span-1 md:col-span-4 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded transition"
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : editingId
              ? "Update Customer"
              : "Add Customer"}
          </button>
        </form>

        <h3 className="text-xl font-semibold mb-4">Customer List</h3>
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">Code</th>
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">Phone</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers && customers.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    No customers found
                  </td>
                </tr>
              )}
              {customers &&
                customers.map((c) => (
                  <tr key={c._id} className="text-center">
                    <td className="border px-4 py-2">{c.customer_code}</td>
                    <td className="border px-4 py-2">{c.customer_name}</td>
                    <td className="border px-4 py-2">{c.email}</td>
                    <td className="border px-4 py-2">{c.phone_number}</td>
                    <td className="border px-4 py-2">{c.status || "Active"}</td>
                    <td className="border px-4 py-2 flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(c)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeactivate(c._id)}
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
