import { useEffect, useState } from "react";


export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal & form state
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ customer: "", amount: "" });

  // Fetch orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://crm-backend-e8xq.onrender.com/api/orders");
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch customers for dropdown
  const fetchCustomers = async () => {
    try {
      const res = await fetch("https://crm-backend-e8xq.onrender.com/api/customers");
      if (!res.ok) throw new Error("Failed to fetch customers");
      const data = await res.json();
      setCustomers(data.customers || []);
    } catch (err) {
      console.error("Error fetching customers:", err);
    }
  };

  // Run both on mount
  useEffect(() => {
    fetchOrders();
    fetchCustomers();
  }, []);

  // Handle new order submission
  const handleAddOrder = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://crm-backend-e8xq.onrender.com/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to add order");
      }

      setForm({ customerId: "", amount: "" });
      setShowModal(false);
      fetchOrders(); // refresh list
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Orders
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track customer purchases and order history
        </p>
      </div>

      {/* Action Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6 flex justify-between items-center">
        <p className="text-gray-600 dark:text-gray-400">
          Total Orders: {orders.length}
        </p>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Add Order
        </button>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
  {loading ? (
    <p className="text-gray-500 dark:text-gray-400">Loading orders...</p>
  ) : error ? (
    <p className="text-red-500">Error: {error}</p>
  ) : orders.length === 0 ? (
    <p className="text-gray-500 dark:text-gray-400">No orders yet.</p>
  ) : (
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-gray-100 dark:bg-gray-700 text-left text-gray-700 dark:text-white">
          <th className="px-4 py-2">Customer</th>
          <th className="px-4 py-2">Email</th>
          <th className="px-4 py-2">Amount</th>
          <th className="px-4 py-2">Date</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((o) => (
          <tr
            key={o._id}
            className="border-t border-gray-200 dark:border-gray-700"
          >
            <td className="px-4 py-2 text-gray-700 dark:text-gray-200">
              {o.customer?.name || "Unknown"}
            </td>
            <td className="px-4 py-2 text-gray-700 dark:text-gray-200">
              {o.customer?.email || "-"}
            </td>
            <td className="px-4 py-2 text-gray-700 dark:text-gray-200">
              ₹{o.amount}
            </td>
            <td className="px-4 py-2 text-gray-700 dark:text-gray-200">
              {new Date(o.date).toLocaleDateString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )}
</div>


      {/* Add Order Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
              Add New Order
            </h2>
            <form onSubmit={handleAddOrder} className="space-y-4">
              {/* Customer Dropdown */}
              <select
                value={form.customer}
                onChange={(e) =>
                  setForm({ ...form, customer: e.target.value })
                }
                required
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">Select Customer</option>
                {customers.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name} ({c.email})
                  </option>
                ))}
              </select>

              {/* Amount Field */}
              <input
                type="number"
                placeholder="Amount (₹)"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                required
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />

              {/* Buttons */}
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
