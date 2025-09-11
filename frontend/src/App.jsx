import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Customers from "./pages/Customers";
import Orders from "./pages/Orders";
import Campaigns from "./pages/Campaigns";
import Stats from "./pages/Stats";
import Login from "./pages/LoginPage";
import AuthSuccess from "./pages/AuthSuccess";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes (no Layout) */}
        <Route path="/login" element={<Login />} />
        <Route path="/auth/success" element={<AuthSuccess />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Protected routes (with Layout) */}
        <Route
          element={<Layout />}
        >
          <Route path="/customers" element={<Customers />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/stats" element={<Stats />} />
        </Route>
      </Routes>
    </Router>
  );
}
