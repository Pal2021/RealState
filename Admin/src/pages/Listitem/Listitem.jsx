import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Listitem.css";

const Listitem = () => {
  const [listings, setListings] = useState([]);
  const [details, setDetails] = useState([]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await axios.get("/api/v1/List/all-listings");
        console.log(response.data);

        const { data, message } = response.data;
        setListings(data);
        setDetails(message);
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    };

    fetchListings();
  }, []);

  const removeListing = async (listingId) => {
    const confirmRemove = window.confirm(
      "Are you sure you want to delete this listing?"
    );
    if (!confirmRemove) return;

    try {
      await axios.delete(`/api/v1/List/remove-listing/${listingId}`);
      setListings(listings.filter((listing) => listing._id !== listingId));
      toast.success("Listing removed successfully!");
    } catch (error) {
      console.error("Error removing listing:", error);
      toast.error("Failed to remove listing.");
    }
  };

  const updateListingStatus = async (listingId) => {
    const confirmSold = window.confirm(
      "Are you sure you want to mark this listing as sold?"
    );
    if (!confirmSold) return;

    try {
      const response = await axios.put(
        `/api/v1/List/update-listing-status/${listingId}`,
        {
          isSold: true,
        }
      );
      const updatedListing = response.data.data;
      setListings(
        listings.map((listing) =>
          listing._id === listingId ? updatedListing : listing
        )
      );
      toast.success("Listing status updated successfully!");
    } catch (error) {
      console.error("Error updating listing status:", error);
      toast.error("Failed to update listing status.");
    }
  };

  if (!Array.isArray(listings) || listings.length === 0) {
    return <p>Loading...</p>;
  }

  return (
    <div className="listitem-container">
      <ToastContainer />
      <h1>Property Listings</h1>
      <div className="listings">
        {listings.map((listing) => {
          const listingDetails = details.find(
            (detail) => detail.listingId === listing._id
          );
          console.log("Listing:", listing);
          console.log("Listing Details:", listingDetails);
          return (
            <div key={listing._id} className="listing-card">
              <Link to={`/listing/${listing._id}`} className="listing-info">
                <h2>{listing.ListName}</h2>
                <p>Address: {listing.address}</p>
                <p>Bedrooms: {listing.bedroom}</p>
                <p>Living Rooms: {listing.livingRoom}</p>
                <p>Bathrooms: {listing.bathroom}</p>
                <p>Parking: {listing.parking}</p>
                <p>Price: {listingDetails?.price}</p>
                <div className="photo-gallery">
                  {listingDetails?.photos.slice(0, 1).map((photo, index) => (
                    <img
                      key={index}
                      src={photo}
                      alt={`Photo ${index}`}
                      className="photo"
                    />
                  ))}
                </div>
              </Link>
              <div className="buttons-container">
                <button
                  onClick={() => removeListing(listing._id)}
                  className="remove-button"
                >
                  Remove
                </button>
                <button
                  onClick={() => updateListingStatus(listing._id)}
                  className="sold-button"
                  disabled={listing.isSold}
                >
                  {listing.isSold ? "Sold" : "Mark as Sold"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Listitem;
