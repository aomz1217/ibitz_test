import React from "react";
import { Navigate } from "react-router-dom";

export default function Auth({ children }) {
  const token = localStorage.getItem("mockToken");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
}
