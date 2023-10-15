import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../userContext';
import { Navigate, useNavigate } from 'react-router-dom';
import ListingShow from './ListingShow';

function Profile({ currentUser }) {
  const userContext = useContext(UserContext);
  const [profile, setProfile] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const getProfile = async () => {
      try {
        const res = await fetch('http://localhost:3001/users/profile', { credentials: 'include' });
        const data = await res.json();
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    getProfile();
  }, []);

  const handleTakeDownListing = async (listingId) => {
    try {
      const response = await fetch(`http://localhost:3001/listings/${listingId}/delete`, {
        method: 'POST',
        credentials: 'include', // Include cookies in the request
      });

      if (response.ok) {
        navigate('/profile');
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
    <>
      {!userContext.user ? <Navigate replace to="/login" /> : ''}
      <h1>User profile</h1>
      <p>Username: {profile.username}</p>
      <p>Email: {profile.email}</p>

      <div>
        <h2>Listings Posted:</h2>
        {profile.listingsPosted && profile.listingsPosted.length > 0 ? (
          <ul>
            {profile.listingsPosted.map((listing) => (
              <div className='listing-card' key={listing._id}>
                <li>
                  <p>Title: {listing.title}</p>
                  <p>Description: {listing.description}</p>
                  <div className="listing-photos">
                    {listing.photos.map((photo) => (
                      <img
                        key={photo._id}
                        className="listing-photo"
                        src={`http://localhost:3001/images/${photo.photoPath}`}
                        alt="Listing Photo"
                      />
                    ))}
                  </div>
                  <button className="btn btn-danger" onClick={() => handleTakeDownListing(listing._id)}>
                    Take Down Listing
                  </button>
                </li>
              </div>
            ))}
          </ul>
        ) : (
          <p>No listings posted.</p>
        )}
      </div>

      <div>
        <h2>Listings Booked:</h2>
        {profile.listingsBooked && profile.listingsBooked.length > 0 ? (
          <ul>
            {profile.listingsBooked.map((listing) => (
              <div className='listing-card' key={listing._id}>
                <li>
                  <p>Title: {listing.title}</p>
                  <p>Description: {listing.description}</p>
                  {/* Add other relevant information */}
                </li>
              </div>
            ))}
          </ul>
        ) : (
          <p>No listings booked.</p>
        )}
      </div>
    </>
  );
}

export default Profile;
