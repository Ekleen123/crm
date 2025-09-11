import { useEffect, useState } from "react";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  // Fetch customers from backend
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/customers");
      if (!res.ok) throw new Error("Failed to fetch customers");
      const data = await res.json();
      setCustomers(data.customers); 
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleAddCustomer = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to add customer");
      }

      setForm({ name: "", email: "", phone: "" });
      setShowModal(false);
      fetchCustomers(); // Refresh customer list
    } catch (err) {
      alert(err.message);
    }
  };

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Customers
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your customer relationships and contact information
        </p>
      </div>

      {/* Action Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className="flex justify-between items-center">
          <input
            type="search"
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                       bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                       transition-colors duration-150 flex items-center space-x-2"
          >
            <span>+ Add Customer</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
  {loading ? (
    <p className="text-gray-500 dark:text-gray-400">Loading customers...</p>
  ) : error ? (
    <p className="text-red-500">Error: {error}</p>
  ) : filtered.length === 0 ? (
    <p className="text-gray-500 dark:text-gray-400">No customers found.</p>
  ) : (
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-gray-100 dark:bg-gray-700 text-left text-gray-700 dark:text-gray-300">
          <th className="px-4 py-2">Name</th>
          <th className="px-4 py-2">Email</th>
          <th className="px-4 py-2">Phone</th>
          <th className="px-4 py-2">Visits</th>
          <th className="px-4 py-2">Spend</th>
        </tr>
      </thead>
      <tbody>
        {filtered.map((c) => (
          <tr
            key={c._id}
            className="border-t border-gray-200 dark:border-gray-700"
          >
            <td className="px-4 py-2 text-gray-700 dark:text-gray-200">{c.name}</td>
            <td className="px-4 py-2 text-gray-700 dark:text-gray-200">{c.email}</td>
            <td className="px-4 py-2 text-gray-700 dark:text-gray-200">{c.phone || "-"}</td>
            <td className="px-4 py-2 text-gray-700 dark:text-gray-200">{c.visits}</td>
            <td className="px-4 py-2 text-gray-700 dark:text-gray-200">₹{c.spend}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )}
</div>

      {/* Add Customer Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
              Add New Customer
            </h2>
            <form onSubmit={handleAddCustomer} className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <input
                type="text"
                placeholder="Phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
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
