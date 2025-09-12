import { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { Plus, X, Edit, Trash2, Users } from "lucide-react";

export default function Customer() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Modal state
  const [open, setOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    customer_code: "",
    customer_name: "",
    email: "",
    phone_number: "",
  });
  const [editingId, setEditingId] = useState(null);

  const BASE_URL = "https://brd-backend-o7n9.onrender.com";
  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  // Fetch customers
  const fetchCustomers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/customers`, config);
      setCustomers(res.data.customers || []);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error fetching customers");
      setCustomers([]);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");
    try {
      if (editingId) {
        await axios.put(
          `${BASE_URL}/api/customers/${editingId}`,
          formData,
          config
        );
        setMessage("✅ Customer updated successfully");
      } else {
        await axios.post(`${BASE_URL}/api/customers`, formData, config);
        setMessage("✅ Customer added successfully");
      }

      setFormData({
        customer_code: "",
        customer_name: "",
        email: "",
        phone_number: "",
      });
      setEditingId(null);
      setOpen(false);
      fetchCustomers();
    } catch (err) {
      setMessage(err.response?.data?.error || "Error saving customer");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (customer = null) => {
    if (customer) {
      setEditingId(customer._id);
      setFormData({
        customer_code: customer.customer_code || "",
        customer_name: customer.customer_name || "",
        email: customer.email || "",
        phone_number: customer.phone_number || "",
      });
    } else {
      setEditingId(null);
      setFormData({
        customer_code: "",
        customer_name: "",
        email: "",
        phone_number: "",
      });
    }
    setOpen(true);
  };

  const handleDeactivate = async (id) => {
    if (
      !window.confirm("⚠️ Are you sure you want to deactivate this customer?")
    )
      return;
    try {
      await axios.put(`${BASE_URL}/api/customers/${id}/deactivate`, {}, config);
      setMessage("⚠️ Customer deactivated");
      fetchCustomers();
    } catch (err) {
      setMessage(err.response?.data?.error || "Error deactivating customer");
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen space-y-8">
      {/* Top Section */}
      <div className="flex justify-between items-center">
        <h2 className="flex items-center gap-2 text-3xl font-bold text-gray-800">
          <Users className="w-8 h-8 text-blue-600" /> Customers
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 shadow-lg hover:shadow-2xl transition"
        >
          <Plus className="w-5 h-5" /> Add Customer
        </motion.button>
      </div>

      {/* Success/Error Message */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 text-center bg-blue-50 text-blue-700 rounded-lg shadow"
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Customer Table */}
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-gray-100">
        <h3 className="text-xl font-semibold mb-6 text-gray-700">
          Customer List
        </h3>
        <div className="overflow-x-auto rounded-lg">
          <table className="w-full table-auto border-collapse">
            <thead className="bg-gray-100 text-gray-600 text-sm uppercase tracking-wider">
              <tr>
                <th className="p-3 text-left">Code</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500">
                    No customers found
                  </td>
                </tr>
              ) : (
                customers.map((c, idx) => (
                  <motion.tr
                    key={c._id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-blue-50/60 transition duration-200"
                  >
                    <td className="p-3 font-medium text-gray-800">
                      {c.customer_code}
                    </td>
                    <td className="p-3">{c.customer_name}</td>
                    <td className="p-3">{c.email}</td>
                    <td className="p-3">{c.phone_number}</td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold shadow ${
                          c.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {c.status || "Active"}
                      </span>
                    </td>
                    <td className="p-3 flex gap-2 justify-center">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => openModal(c)}
                        className="flex items-center gap-1 bg-yellow-400 hover:bg-yellow-500 text-white py-1.5 px-3 rounded-lg shadow"
                      >
                        <Edit size={16} /> Edit
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDeactivate(c._id)}
                        className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white py-1.5 px-3 rounded-lg shadow"
                      >
                        <Trash2 size={16} /> Deactivate
                      </motion.button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Modal */}
      <Transition appear show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 backdrop-blur-none"
            enterTo="opacity-100 backdrop-blur-sm"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 backdrop-blur-sm"
            leaveTo="opacity-0 backdrop-blur-none"
          >
            <div className="fixed inset-0 bg-black/40" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-8 scale-95"
              enterTo="opacity-100 translate-y-0 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 scale-100"
              leaveTo="opacity-0 translate-y-8 scale-95"
            >
              <Dialog.Panel className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 relative">
                <div className="flex justify-between items-center border-b pb-4 mb-6">
                  <Dialog.Title className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Users className="w-6 h-6 text-blue-600" />{" "}
                    {editingId ? "Edit Customer" : "Add Customer"}
                  </Dialog.Title>
                  <button
                    onClick={() => setOpen(false)}
                    className="p-2 rounded-full hover:bg-gray-100 transition"
                  >
                    <X size={22} className="text-gray-500" />
                  </button>
                </div>

                {/* Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    "customer_code",
                    "customer_name",
                    "email",
                    "phone_number",
                  ].map((field, idx) => (
                    <motion.input
                      key={field}
                      type={field === "email" ? "email" : "text"}
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      placeholder={field
                        .replace("_", " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                      className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                      required
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    />
                  ))}
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-end mt-6 gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setOpen(false)}
                    className="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-lg"
                  >
                    {loading ? "Saving..." : editingId ? "Update" : "Save"}
                  </motion.button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
