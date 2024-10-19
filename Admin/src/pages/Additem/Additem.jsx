import React, { useState, useRef } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Additem.css";

const Additem = () => {
  const [formData, setFormData] = useState({
    address: "",
    bedroom: "",
    livingRoom: "",
    bathroom: "",
    parking: "",
    isSold: false,
    ListName: "",
    description: "",
    photos: [],
    location: "",
    price: "",
  });

  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + formData.photos.length > 8) {
      toast.error("You can upload a maximum of 8 photos.");
      return;
    }
    setFormData((prevData) => ({
      ...prevData,
      photos: [...prevData.photos, ...files],
    }));
    setPhotoPreviews((prevPreviews) => [
      ...prevPreviews,
      ...files.map((file) => URL.createObjectURL(file)),
    ]);
  };

  const removePhoto = (indexToRemove) => {
    setFormData((prevData) => ({
      ...prevData,
      photos: prevData.photos.filter((_, index) => index !== indexToRemove),
    }));
    setPhotoPreviews((prevPreviews) =>
      prevPreviews.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const data = new FormData();
    data.append("address", formData.address);
    data.append("bedroom", formData.bedroom);
    data.append("livingRoom", formData.livingRoom);
    data.append("bathroom", formData.bathroom);
    data.append("parking", formData.parking);
    data.append("isSold", formData.isSold);
    data.append("ListName", formData.ListName);
    data.append("description", formData.description);
    data.append("location", formData.location);
    data.append("price", formData.price);
    formData.photos.forEach((photo) => {
      data.append("photos", photo);
    });

    try {
      const response = await axios.post("/api/v1/List/Listing", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response.data);
      toast.success("Listing added successfully!");
      setFormData({
        address: "",
        bedroom: "",
        livingRoom: "",
        bathroom: "",
        parking: "",
        isSold: false,
        ListName: "",
        description: "",
        photos: [],
        location: "",
        price: "",
      });
      setPhotoPreviews([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error(error);
      toast.error("Error adding listing.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="additem-container">
      <ToastContainer />
      <form onSubmit={handleSubmit}>
        <label>
          Address:
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Bedroom:
          <input
            type="number"
            name="bedroom"
            value={formData.bedroom}
            onChange={handleChange}
            required
            min="0"
          />
        </label>
        <label>
          Living Room:
          <input
            type="number"
            name="livingRoom"
            value={formData.livingRoom}
            onChange={handleChange}
            required
            min="0"
          />
        </label>
        <label>
          Bathroom:
          <input
            type="number"
            name="bathroom"
            value={formData.bathroom}
            onChange={handleChange}
            required
            min="0"
          />
        </label>
        <label>
          Parking:
          <input
            type="number"
            name="parking"
            value={formData.parking}
            onChange={handleChange}
            required
            min="0"
          />
        </label>
        <label>
          Is Sold:
          <input
            type="checkbox"
            name="isSold"
            checked={formData.isSold}
            onChange={handleChange}
          />
        </label>
        <label>
          List Name:
          <input
            type="text"
            name="ListName"
            value={formData.ListName}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Location:
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Price:
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
          />
        </label>
        <label>
          Photos (Max 8):
          <input
            type="file"
            name="photos"
            onChange={handleFileChange}
            multiple
            required
            accept="image/*"
            ref={fileInputRef}
          />
        </label>
        <div className="photo-previews">
          {photoPreviews.map((src, index) => (
            <div key={index} className="photo-preview-wrapper">
              <img
                src={src}
                alt={`Preview ${index}`}
                className="photo-preview"
              />
              <button
                type="button"
                className="remove-photo-button"
                onClick={() => removePhoto(index)}
              >
                &times;
              </button>
            </div>
          ))}
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Listing"}
        </button>
      </form>
    </div>
  );
};

export default Additem;
