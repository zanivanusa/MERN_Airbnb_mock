import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../userContext';
import { useParams, useNavigate } from 'react-router-dom';

function ListingDetails({ currentUser }) {
  const { id } = useParams(); // Retrieve the listing ID from the URL parameters
  const [listing, setListing] = useState(null);
  const userContext = useContext(UserContext);
  const { user } = userContext;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await fetch(`http://localhost:3001/listings/detailed/${id}`, {
          method: 'GET',
          credentials: 'include', // Include cookies in the request
        });
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setListing(data); // Update the listing state with the fetched data
        } else {
          console.error('Failed to fetch listing:', response.status);
          // Handle the error or show an error message to the user
        }
      } catch (error) {
        console.error('Error fetching listing:', error);
        // Handle the error or show an error message to the user
      }
    };

    fetchListing();
  }, []);

  const handleBookListing = async () => {
    try {
      const response = await fetch(`http://localhost:3001/listings/${id}/book`, {
        method: 'POST',
        credentials: 'include', // Include cookies in the request
      });
      if (response.ok) {
        // Handle successful booking
        navigate('/'); // Redirect to the booking confirmation page
      } else {
        console.error('Error booking listing:', response.status);
        // Handle the error or show an error message to the user
      }
    } catch (error) {
      console.error('Error booking listing:', error);
      // Handle the error or show an error message to the user
    }
  };

  const handleTakeDownListing = async () => {
    try {
      const response = await fetch(`http://localhost:3001/listings/${listing.listing._id}/delete`, {
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

  if (!listing) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h3>Listing Details</h3>
      <div className="listing-details">
        <h2>{listing.listing.title}</h2>
        <h3>Price: {listing.listing.price} € a night</h3>
        <h3>Location: {listing.listing.location}</h3>
        <h3>{listing.listing.description}</h3>
        <div className="listing-photos">
          {listing.listing.photos.map((photo) => (
            <div className="listing-card" key={photo._id}>
              <img
                className="listing-photo"
                src={`http://localhost:3001/images/${photo.photoPath}`}
                alt="Listing Photo"
              />
            </div>
          ))}
        </div>
        <div className="user-details">
          <p>User: {listing.user.username}</p>
          <p>Email: {listing.user.email}</p>
          {user && user._id !== listing.postedBy && (
            <div>
              <button className="btn btn-primary" onClick={handleBookListing}>
                Book This Listing
              </button>
            </div>
          )}
        </div>
        {user && user._id === listing.postedBy && (
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

export default ListingDetails;
