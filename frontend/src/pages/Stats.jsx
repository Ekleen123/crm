// src/pages/Stats.jsx
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Stats() {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("https://crm-backend-e8xq.onrender.com/api/stats");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };

    const fetchOrders = async () => {
      try {
        const res = await fetch("https://crm-backend-e8xq.onrender.com/api/orders");
        const data = await res.json();
        setOrders(data.orders || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    const fetchCustomers = async () => {
      try {
        const res = await fetch("https://crm-backend-e8xq.onrender.com/api/customers");
        const data = await res.json();
        // Sort top 5 customers by spend
        setTopCustomers(data.customers.sort((a, b) => b.spend - a.spend).slice(0, 5));
      } catch (err) {
        console.error("Error fetching customers:", err);
      }
    };

    Promise.all([fetchStats(), fetchOrders(), fetchCustomers()]).finally(() =>
      setLoading(false)
    );
  }, []);

  // Prepare chart data: group orders by date
  const chartData = orders.reduce((acc, order) => {
    const date = new Date(order.date).toLocaleDateString("en-GB");
    const existing = acc.find((d) => d.date === date);
    if (existing) {
      existing.orders += 1;
      existing.revenue += order.amount;
    } else {
      acc.push({ date, orders: 1, revenue: order.amount });
    }
    return acc;
  }, []);

  if (loading) {
    return <p className="text-gray-500 dark:text-gray-400">Loading stats...</p>;
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Business overview and performance insights
        </p>
      </div>

      {/* KPI Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="p-6 bg-white dark:bg-gray-800 shadow rounded-lg">
            <h3 className="text-gray-500 dark:text-gray-400">Total Orders</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.totalOrders}
            </p>
          </div>
          <div className="p-6 bg-white dark:bg-gray-800 shadow rounded-lg">
            <h3 className="text-gray-500 dark:text-gray-400">Revenue</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              ₹{stats.totalRevenue}
            </p>
          </div>
          <div className="p-6 bg-white dark:bg-gray-800 shadow rounded-lg">
            <h3 className="text-gray-500 dark:text-gray-400">Avg Order</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              ₹{stats.avgOrderValue.toFixed(2)}
            </p>
          </div>
          <div className="p-6 bg-white dark:bg-gray-800 shadow rounded-lg">
            <h3 className="text-gray-500 dark:text-gray-400">Top Customer</h3>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {stats.topCustomer?.name || "N/A"}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              ₹{stats.topCustomer?.spend || 0}
            </p>
          </div>
        </div>
      )}

      {/* Orders Chart */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Orders Over Time
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="orders" stroke="#2563eb" />
            <Line type="monotone" dataKey="revenue" stroke="#16a34a" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Top Customers */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Top Customers
        </h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700 text-left">
              <th className="px-4 py-2  text-gray-700 dark:text-gray-200">Name</th>
              <th className="px-4 py-2  text-gray-700 dark:text-gray-200">Email</th>
              <th className="px-4 py-2  text-gray-700 dark:text-gray-200">Spend</th>
              <th className="px-4 py-2  text-gray-700 dark:text-gray-200">Visits</th>
            </tr>
          </thead>
          <tbody>
  {topCustomers.map((c) => (
    <tr
      key={c._id}
      className="border-t border-gray-200 dark:border-gray-700"
    >
      <td className="px-4 py-2 text-gray-700 dark:text-gray-200">{c.name}</td>
      <td className="px-4 py-2 text-gray-700 dark:text-gray-200">{c.email}</td>
      <td className="px-4 py-2 text-gray-700 dark:text-gray-200">₹{c.spend}</td>
      <td className="px-4 py-2 text-gray-700 dark:text-gray-200">{c.visits}</td>
    </tr>
  ))}
</tbody>

        </table>
      </div>
    </div>
  );
}
