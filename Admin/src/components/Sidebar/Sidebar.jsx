import React from "react";
import "./Sidebar.css";
import image1 from "../../assets/image1.png";
import Listlogo1 from "../../assets/Listlogo1.png";
import Solditem from "../../assets/Solditem.png";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-options">
        <NavLink to="/add" className="sidebar-option">
          <img src={image1} alt="Add Items" />
          <p>Add Items</p>
        </NavLink>

        <NavLink to="/list" className="sidebar-option">
          <img src={Listlogo1} alt="List Items" />
          <p>List Items</p>
        </NavLink>

        <NavLink to="/soldlist" className="sidebar-option">
          <img src={Solditem} alt="Sold Items" />
          <p>Sold Items</p>
        </NavLink>
        <NavLink to="/testimonial" className="sidebar-option">
          <img src={image1} alt="Add Testimonial" />
          <p>Add Testimonial</p>
        </NavLink>
        <NavLink to="/get-testimonial" className="sidebar-option">
          <img src={Listlogo1} alt="Get Testimonials" />
          <p>Get Testimonials</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
