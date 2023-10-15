import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ListingShow({ listing, currentUser }) {
  const [photos, setPhotos] = useState([]);
  const navigate = useNavigate();

  const handleBookListing = () => {
    navigate(`/detailed/${listing._id}`);
  };

  const handleTakeDownListing = async () => {
    try {
      const response = await fetch(`http://localhost:3001/listings/${listing._id}/delete`, {
        method: 'POST',
        credentials: 'include', // Include cookies in the request
      });

      if (response.ok) {
        navigate('/');
        // Listing taken down successfully
        // Perform any necessary actions, such as updating the UI
      } else {
        // Handle the error or show an error message to the user
        console.error('Failed to take down the listing:', response.status);
      }
    } catch (error) {
      console.error('Error taking down the listing:', error);
      // Handle the error or show an error message to the user
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <h4 className="card-title">{listing.title}</h4>
        <p className="card-text">{listing.location}</p>
        <p className="card-text">{listing.price} € a night</p>

        {!listing.booked && (
          <button className="btn btn-primary" onClick={handleBookListing}>
            Closer look
          </button>
        )}
        {currentUser && currentUser._id === listing.postedBy && (
          <div>
            <button className="btn btn-danger" onClick={handleTakeDownListing}>
              Take Down Listing
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default ListingShow;
