import React, { useState, useContext } from 'react';
import { UserContext } from '../userContext';
import { useNavigate } from 'react-router-dom';

function Listing() {
  const userContext = useContext(UserContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [photos, setPhotos] = useState([]);

  const navigate = useNavigate();
  const { user } = userContext;

  const handleCreateListing = async () => {
    if (!title || !location || !price || photos.length === 0) {
      alert('Please provide a title, location, the price and at least one photo.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('location', location);
      formData.append('postedBy', user._id);
      for (let i = 0; i < photos.length; i++) {
        formData.append('photos', photos[i]);
      }
      formData.append('isBooked', false);

      const response = await fetch('http://localhost:3001/listings', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const listing = await response.json();
        navigate('/'); // Redirect to the index page
      } else {
        console.error('Error creating listing:', response.status);
        alert('Listing creation failed.');
      }
    } catch (error) {
      console.error('Error creating listing:', error);
      alert('Listing creation failed.');
    }
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handlePriceChange = (event) => {
    setPrice(event.target.value);
  };

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  const handlePhotoChange = (event) => {
    const selectedPhotos = event.target.files;
    setPhotos(Array.from(selectedPhotos));
  };

  return (
    <div className="container">
      <h3>Create Listing</h3>
      <form>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Title:</label>
          <input type="text" className="form-control" id="title" value={title} onChange={handleTitleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description:</label>
          <input type="text" className="form-control" id="description" value={description} onChange={handleDescriptionChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="price" className="form-label">Price:</label>
          <input type="number" className="form-control" id="price" value={price} onChange={handlePriceChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="location" className="form-label">Location:</label>
          <input type="text" className="form-control" id="location" value={location} onChange={handleLocationChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="photo" className="form-label">Photo:</label>
          <input type="file" className="form-control" id="photo" accept="image/*" multiple onChange={handlePhotoChange} />
        </div>
        <button type="button" className="btn btn-primary" onClick={handleCreateListing}>Create Listing</button>
      </form>
    </div>
  );
}

export default Listing;
