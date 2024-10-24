import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState(""); // Search term state
  const [images, setImages] = useState([]); // Array to store fetched images
  const API_KEY = "46697526-a622015f37acfda96112752b6"; // Your Pixabay API key
  const navigate = useNavigate(); // React Router's navigate function

  // Fetch images based on the search term
  const fetchImages = async () => {
    const url = `https://pixabay.com/api/?key=${API_KEY}&q=${encodeURIComponent(
      searchTerm
    )}&image_type=photo`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      setImages(data.hits); // Store fetched images in state
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  // Handle navigating to the Add Caption page
  const handleAddCaptionClick = (id) => {
    navigate(`/add-caption/${id}`); // Navigate to Add Caption page with image ID
  };

  return (
    <div>
      <h2>Image Search Page</h2>
      {/* Search bar for user to input search term */}
      <div className="search-bar">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for images..."
        />
        <button onClick={fetchImages}>Search</button>
      </div>

      {/* Display search results */}
      <div className="image-results">
        {images.length > 0 ? (
          images.map((image) => (
            <div key={image.id} className="image-card">
              <img
                src={image.webformatURL}
                alt={image.tags}
                width={150}
              />
              {/* Add Captions Button */}
              <button onClick={() => handleAddCaptionClick(image.id)}>
                Add Captions
              </button>
            </div>
          ))
        ) : (
          <p>No images found. Try searching for something else.</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
