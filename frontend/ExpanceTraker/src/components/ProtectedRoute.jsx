import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import API from "../api";
import LoadingSpinner from "./LoadingSpinner";
import toast from "react-hot-toast";

export default function ProtectedRoute({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        const response = await API.get("/verify-token");
        if (response.data.valid) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem("token");
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Token verification failed:", error);
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        if (error.response?.status !== 401) {
          toast.error("Authentication error. Please login again.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, []);

  if (isLoading) {
    return <LoadingSpinner message="Checking authentication..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
