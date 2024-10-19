import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ListingDetail.css";

const ListingDetail = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [details, setDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [existingPhotos, setExistingPhotos] = useState([]);
  const [newPhotos, setNewPhotos] = useState([]);
  const [formData, setFormData] = useState({
    ListName: "",
    address: "",
    bedroom: "",
    livingRoom: "",
    bathroom: "",
    parking: "",
    isSold: false,
    description: "",
    location: "",
    price: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListingDetails = async () => {
      try {
        const response = await axios.get(`/api/v1/List/all-listings`);
        const { data, message } = response.data;

        const selectedListing = data.find((item) => item._id === id);
        const selectedDetails = message.find(
          (detail) => detail.listingId === id
        );

        setListing(selectedListing);
        setDetails(selectedDetails);
        setExistingPhotos(selectedDetails.photos);
        setFormData({
          ListName: selectedListing.ListName,
          address: selectedListing.address,
          bedroom: selectedListing.bedroom,
          livingRoom: selectedListing.livingRoom,
          bathroom: selectedListing.bathroom,
          parking: selectedListing.parking,
          isSold: selectedListing.isSold,
          description: selectedDetails.description,
          location: selectedDetails.location,
          price: selectedDetails.price,
        });

        // console.log("Initial State:", {
        //   selectedListing,
        //   selectedDetails,
        //   existingPhotos: selectedDetails.photos,
        // });
      } catch (error) {
        console.error("Error fetching listing details:", error);
      }
    };

    fetchListingDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDeletePhoto = (index, type) => {
    if (type === "existing") {
      const updatedPhotos = existingPhotos.filter((_, i) => i !== index);
      setExistingPhotos(updatedPhotos);
    } else {
      const updatedPhotos = newPhotos.filter((_, i) => i !== index);
      setNewPhotos(updatedPhotos);
    }
  };

  const handleAddPhotos = (e) => {
    const addedPhotos = Array.from(e.target.files);
    const totalPhotos =
      existingPhotos.length + newPhotos.length + addedPhotos.length;
    if (totalPhotos <= 8) {
      setNewPhotos([...newPhotos, ...addedPhotos]);
    } else {
      toast.error("You can only upload up to 8 photos.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const totalPhotos = existingPhotos.length + newPhotos.length;
    if (totalPhotos < 1 || totalPhotos > 8) {
      toast.error("You must upload between 1 and 8 photos.");
      return;
    }

    const form = new FormData();
    for (const key in formData) {
      form.append(key, formData[key]);
    }
    existingPhotos.forEach((photo, index) => {
      form.append(`existingPhotos`, photo); // Ensure backend expects this field
    });
    newPhotos.forEach((photo, index) => {
      form.append(`photos`, photo); // Ensure backend expects this field
    });

    try {
      //console.log(id);
      // console.log("Form Data:");
      // for (let [key, value] of form.entries()) {
      //   console.log(key, value);
      // }

      const updateResponse = await axios.put(
        `/api/v1/List/update-listing/${id}`,
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // console.log("Update Response:", updateResponse);

      toast.success("Listing updated successfully!");
      setIsEditing(false);

      const response = await axios.get(`/api/v1/List/all-listings`);
      const { data, message } = response.data;
      const updatedListing = data.find((item) => item._id === id);
      const updatedDetails = message.find((detail) => detail.listingId === id);

      setListing(updatedListing);
      setDetails(updatedDetails);
      setExistingPhotos(updatedDetails.photos);
      setNewPhotos([]);
      setFormData({
        ListName: updatedListing.ListName,
        address: updatedListing.address,
        bedroom: updatedListing.bedroom,
        livingRoom: updatedListing.livingRoom,
        bathroom: updatedListing.bathroom,
        parking: updatedListing.parking,
        isSold: updatedListing.isSold,
        description: updatedDetails.description,
        location: updatedDetails.location,
        price: updatedDetails.price,
      });

      // console.log("State after successful update:", {
      //   updatedListing,
      //   updatedDetails,
      //   existingPhotos: updatedDetails.photos,
      // });

      setTimeout(() => navigate("/list"), 3000);
    } catch (error) {
      console.error("Error updating listing:", error);
      toast.error("Error updating listing. Please try again.");
    }
  };

  if (!listing || !details) {
    return <p>Loading...</p>;
  }

  return (
    <div className="listing-detail-container">
      <ToastContainer />
      {!isEditing ? (
        <>
          <h1>{listing.ListName}</h1>
          <p>Address: {listing.address}</p>
          <p>Bedrooms: {listing.bedroom}</p>
          <p>Living Rooms: {listing.livingRoom}</p>
          <p>Bathrooms: {listing.bathroom}</p>
          <p>Parking: {listing.parking}</p>
          <p>{listing.isSold ? "Sold" : "Available"}</p>
          <p>Description: {details.description}</p>
          <p>Location: {details.location}</p>
          <p>Price: {details.price}</p>
          <div className="photo-gallery">
            {existingPhotos.map((photo, index) => (
              <div className="photo-container" key={index}>
                <img src={photo} alt={`Photo ${index}`} className="photo" />
              </div>
            ))}
            {newPhotos.map((photo, index) => (
              <div className="photo-container" key={index}>
                <img
                  src={URL.createObjectURL(photo)}
                  alt={`Photo ${index}`}
                  className="photo"
                />
              </div>
            ))}
          </div>
          <button onClick={() => setIsEditing(true)}>Edit</button>
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label>List Name:</label>
            <input
              type="text"
              name="ListName"
              value={formData.ListName}
              onChange={handleChange}
              placeholder="List Name"
            />
          </div>
          <div>
            <label>Address:</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
            />
          </div>
          <div>
            <label>Bedrooms:</label>
            <input
              type="number"
              name="bedroom"
              value={formData.bedroom}
              onChange={handleChange}
              placeholder="Bedroom"
            />
          </div>
          <div>
            <label>Living Room:</label>
            <input
              type="number"
              name="livingRoom"
              value={formData.livingRoom}
              onChange={handleChange}
              placeholder="Living Room"
            />
          </div>
          <div>
            <label>Bathrooms:</label>
            <input
              type="number"
              name="bathroom"
              value={formData.bathroom}
              onChange={handleChange}
              placeholder="Bathroom"
            />
          </div>
          <div>
            <label>Parking:</label>
            <input
              type="text"
              name="parking"
              value={formData.parking}
              onChange={handleChange}
              placeholder="Parking"
            />
          </div>
          <div>
            <label>
              Sold:
              <input
                type="checkbox"
                name="isSold"
                checked={formData.isSold}
                onChange={() =>
                  setFormData({ ...formData, isSold: !formData.isSold })
                }
              />
            </label>
          </div>
          <div>
            <label>Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
            ></textarea>
          </div>
          <div>
            <label>Location:</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Location"
            />
          </div>
          <div>
            <label>Price:</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Price"
            />
          </div>
          {existingPhotos.length + newPhotos.length < 8 && (
            <div>
              <label>Photos:</label>
              <input
                type="file"
                name="photos"
                multiple
                onChange={handleAddPhotos}
              />
            </div>
          )}
          <div className="photo-gallery">
            {existingPhotos.map((photo, index) => (
              <div className="photo-container" key={index}>
                <img src={photo} alt={`Photo ${index}`} className="photo" />
                <button
                  className="delete-photo"
                  onClick={() => handleDeletePhoto(index, "existing")}
                  type="button"
                >
                  &times;
                </button>
              </div>
            ))}
            {newPhotos.map((photo, index) => (
              <div className="photo-container" key={index}>
                <img
                  src={URL.createObjectURL(photo)}
                  alt={`Photo ${index}`}
                  className="photo"
                />
                <button
                  className="delete-photo"
                  onClick={() => handleDeletePhoto(index, "new")}
                  type="button"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
          <button type="submit">Update Listing</button>
          <button type="button" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};

export default ListingDetail;
