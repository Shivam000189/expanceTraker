import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import API from "../api";
import LoadingSpinner from "./LoadingSpinner";

export default function ProtectedRoute({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Simulate a small delay to show loader
    setTimeout(() => {
      setIsAuthenticated(!!token);
      setIsLoading(false);
    }, 400);
  }, []);

  if (isLoading) return <LoadingSpinner message="Checking authentication..." />;

  

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
