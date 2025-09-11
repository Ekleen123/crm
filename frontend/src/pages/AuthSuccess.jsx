import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthSuccess() {
  const navigate = useNavigate();
  const handled = useRef(false); // prevent double execution

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    console.log("Full query string:", window.location.search);
    console.log("Token from URL:", token);

    if (token) {
      localStorage.setItem("token", token);
      navigate("/stats", { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  return <p>Logging you in...</p>;
}
