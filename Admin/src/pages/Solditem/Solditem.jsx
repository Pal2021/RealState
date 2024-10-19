import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Solditem.css";

const Solditem = () => {
  const [listings, setListings] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await axios.get("/api/v1/List/all-listings");
        const { data } = response.data;
        if (Array.isArray(data)) {
          const soldListings = data.filter((listing) => listing.isSold);
          setListings(soldListings);
        } else {
          throw new Error("Unexpected response format");
        }
      } catch (error) {
        console.error("Error fetching listings:", error);
        setError("Failed to load listings. Please try again later.");
      }
    };
    fetchListings();
  }, []);

  return (
    <div className="listitem-container">
      <h1>Sold Property Listings</h1>
      {error && <p className="error-message">{error}</p>}
      <div className="listings">
        {listings.length === 0 && !error ? (
          <p>No sold listings available.</p>
        ) : (
          listings.map((listing) => (
            <div key={listing._id} className="listing-card">
              <img
                src={listing.cardPhoto}
                alt={`${listing.ListName} Photo`}
                className="card-photo"
              />
              <div className="listing-info">
                <h2>{listing.ListName}</h2>
                <p>Address: {listing.address}</p>
                <p>Bedrooms: {listing.bedroom}</p>
                <p>Living Rooms: {listing.livingRoom}</p>
                <p>Bathrooms: {listing.bathroom}</p>
                <p>Parking: {listing.parking}</p>
                <p>{listing.isSold ? "Sold" : "Available"}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Solditem;
