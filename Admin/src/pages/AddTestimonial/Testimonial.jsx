import React, { useState } from "react";
import axios from "axios";
import "./Testimonial.css";

const Testimonial = () => {
  const [user, setUser] = useState("");
  const [comment, setComment] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const testimonialData = {
      user,
      comment,
    };

    try {
      const response = await axios.post(
        "/api/v1/user/Add-Testimonials",
        testimonialData
      );
      console.log("Response:", response.data);
      alert("Testimonial submitted successfully!");

      setUser("");
      setComment("");
    } catch (error) {
      console.error("Error submitting testimonial:", error);
      alert("Failed to submit testimonial. Please try again.");
    }
  };

  return (
    <div className="testimonial-container">
      <h2>Submit a Testimonial</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            User:
            <input
              type="text"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Comment:
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
          </label>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Testimonial;
