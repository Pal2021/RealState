import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./GetTestimonial.css";

const GetTestimonial = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editUser, setEditUser] = useState("");
  const [editComment, setEditComment] = useState("");

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await axios.get("/api/v1/user/getAllTestimonial");

        if (response.data && Array.isArray(response.data.data)) {
          setTestimonials(response.data.data);
        } else {
          setTestimonials([]);
        }
      } catch (error) {
        toast.error("Error fetching testimonials");
      }
    };

    fetchTestimonials();
  }, []);

  const handleRemove = async (index) => {
    const testimonialId = testimonials[index]._id;
    try {
      await axios.delete(`/api/v1/user/delete-Testimonial/${testimonialId}`);
      setTestimonials(testimonials.filter((_, i) => i !== index));
      toast.success("Testimonial removed successfully");
    } catch (error) {
      toast.error("Error deleting testimonial");
    }
  };
  const handleUpdate = async (index) => {
    const testimonialId = testimonials[index]._id;
    try {
      await axios.put(`/api/v1/user/update-testimonial/${testimonialId}`, {
        user: editUser,
        comment: editComment,
      });
      setTestimonials((prevTestimonials) =>
        prevTestimonials.map((testimonial, i) =>
          i === index
            ? { ...testimonial, user: editUser, comment: editComment }
            : testimonial
        )
      );
      setEditIndex(null);
      setEditUser("");
      setEditComment("");
      toast.success("Testimonial updated successfully");
    } catch (error) {
      toast.error("Error updating testimonial");
    }
  };

  const handleEditClick = (index, user, comment) => {
    setEditIndex(index);
    setEditUser(user);
    setEditComment(comment);
  };

  const handleUserChange = (e) => {
    setEditUser(e.target.value);
  };

  const handleCommentChange = (e) => {
    setEditComment(e.target.value);
  };

  return (
    <div className="get-testimonial-container">
      <h2>Testimonials</h2>
      {testimonials.length === 0 ? (
        <p>No testimonials available.</p>
      ) : (
        <ul>
          {testimonials.map((testimonial, index) => (
            <li key={index}>
              <p>
                <strong>
                  {editIndex === index ? (
                    <input
                      type="text"
                      value={editUser}
                      onChange={handleUserChange}
                    />
                  ) : (
                    testimonial.user
                  )}
                </strong>{" "}
                {editIndex === index ? (
                  <textarea
                    value={editComment}
                    onChange={handleCommentChange}
                    rows="4"
                  />
                ) : (
                  testimonial.comment
                )}
              </p>
              {editIndex === index ? (
                <div>
                  <button onClick={() => handleUpdate(index)}>Update</button>
                  <button onClick={() => setEditIndex(null)}>Cancel</button>
                </div>
              ) : (
                <div>
                  <button
                    onClick={() =>
                      handleEditClick(
                        index,
                        testimonial.user,
                        testimonial.comment
                      )
                    }
                  >
                    Edit
                  </button>
                  <button onClick={() => handleRemove(index)}>Remove</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
      <ToastContainer />
    </div>
  );
};

export default GetTestimonial;
