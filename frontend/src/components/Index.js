import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../userContext';
import ListingShow from './ListingShow';

function Index() {
  const [listings, setListings] = useState([]);
  const userContext = useContext(UserContext);
  const { user } = userContext;

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch(`http://localhost:3001/listings/`, {
          method: 'GET',
          credentials: 'include', // Include cookies in the request
        });
        if (response.ok) {
          const data = await response.json();
          setListings(data); // Update the listings state with the fetched data
        } else {
          console.error('Failed to fetch listings:', response.status);
          // Handle the error or show an error message to the user
        }
      } catch (error) {
        console.error('Error fetching listings:', error);
        // Handle the error or show an error message to the user
      }
    };

    fetchListings();
  }, []);

  return (
    <div>
      <h3>Here are all available listings sorted by price ascending:</h3>
      <div className="listings-container">
        {listings.map((listing) => {
          // Skip rendering if the listing is booked
          if (listing.isBooked) {
            return null;
          }
  
          return (
            <div key={listing._id} className="listing-card">
              <ListingShow
                listing={listing}
                onBook={() => ListingShow.handleBookListing(listing._id)}
                onTakeDown={() => ListingShow.handleTakeDownListing(listing._id)}
                currentUser={user}
              />
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
            </div>
          );
        })}
      </div>
    </div>
  );
  
}

export default Index;
