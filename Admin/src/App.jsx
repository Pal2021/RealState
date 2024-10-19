import React, { useState } from "react";
import Sidebar from "./components/Sidebar/Sidebar.jsx";
import Additem from "./pages/Additem/Additem.jsx";
import Listitem from "./pages/Listitem/Listitem.jsx";
import Soldlist from "./pages/Solditem/Solditem.jsx";
import Testimonial from "./pages/AddTestimonial/Testimonial.jsx";
import GetTestimonial from "./pages/GetTestimonial/GetTestimonial.jsx";
import ListingDetail from "./pages/ListitemDetails/ListitemDetails.jsx";
import Login from "./pages/Login/Login.jsx";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import "./index.css";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (username, password) => {
    if (username === "1" && password === "1") {
      setIsAuthenticated(true);
      navigate("/list");
    } else {
      alert("Invalid username or password");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <div className="app-container">
      {isAuthenticated && <Sidebar onLogout={handleLogout} />}
      <div className="content-container">
        <Routes>
          <Route
            path="/"
            element={isAuthenticated ? <Listitem /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/list" />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/add"
            element={isAuthenticated ? <Additem /> : <Navigate to="/login" />}
          />
          <Route
            path="/list"
            element={isAuthenticated ? <Listitem /> : <Navigate to="/login" />}
          />
          <Route
            path="/soldlist"
            element={isAuthenticated ? <Soldlist /> : <Navigate to="/login" />}
          />
          <Route
            path="/listing/:id"
            element={
              isAuthenticated ? <ListingDetail /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/testimonial"
            element={
              isAuthenticated ? <Testimonial /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/get-testimonial"
            element={
              isAuthenticated ? <GetTestimonial /> : <Navigate to="/login" />
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default App;
