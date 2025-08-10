import React, { lazy } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Layout from "./Layout";
import { ToastContainer } from "react-toastify";
const MovieList = lazy(() => import("./components/Movie/MovieList"));
const MovieForm = lazy(() => import("./components/Movie/CreateMovie"));
const Login = lazy(() => import("./components/admin/Login"));
const Register = lazy(() => import("./components/admin/Register"));
const ChangePassword = lazy(() => import("./components/admin/ChangePassword"));
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="changepassword" element={<ChangePassword />} />

          <Route path="movielist" element={<MovieList />} />
          <Route path="movielist/create" element={<MovieForm />} />
          <Route path="movielist/edit/:id" element={<MovieForm />} />
        </Route>
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
