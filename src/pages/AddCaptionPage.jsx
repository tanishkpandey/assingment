import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { FabricImage, Canvas, Textbox, Circle, Rect, Triangle, Polygon } from 'fabric'; // Import for latest version

const AddCaptionPage = () => {
  const { id } = useParams(); // Get the image ID from the route
  const canvasRef = useRef(null); // Canvas reference
  const [canvas, setCanvas] = useState(null); // Fabric.js canvas instance
  const [imageUrl, setImageUrl] = useState(null); // Store the image URL
  const API_KEY = "46697526-a622015f37acfda96112752b6"; // Your Pixabay API key

  // Fetch image data based on ID
  useEffect(() => {
    const fetchImage = async () => {
      const url = `https://pixabay.com/api/?key=${API_KEY}&id=${id}`; // Fetch image by ID
      try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.hits.length > 0) {
          const image = data.hits[0]; // Get the first result
          setImageUrl(image.largeImageURL); // Set the image URL to be used for the canvas
        } else {
          console.error("Image not found");
        }
      } catch (error) {
        console.error("Error fetching image:", error); // DEBUG: Log any fetch errors
      }
    };

    fetchImage();
  }, [id]);

  // Initialize the Fabric.js canvas
  useEffect(() => {
    const fabricCanvas = new Canvas(canvasRef.current, {
      width: 600,
      height: 400,
    });
    setCanvas(fabricCanvas);

    return () => {
      fabricCanvas.dispose(); // Cleanup on component unmount
    };
  }, []);

  // Add the image to the Fabric.js canvas when the image URL is available
  useEffect(() => {
    const loadImage = async () => {
      if (imageUrl && canvas) {
        // Clear any existing content on the canvas
        canvas.clear();

        try {
          // Load image using promise-based API with crossOrigin
          const img = await FabricImage.fromURL(imageUrl, { crossOrigin: "anonymous" });

          // Scale image while keeping aspect ratio
          const maxWidth = 500; // Set desired width for the image
          const maxHeight = 500; // Set desired height for the image

          if (img.width > img.height) {
            img.scaleToWidth(maxWidth); // Scale the width and maintain aspect ratio
          } else {
            img.scaleToHeight(maxHeight); // Scale the height and maintain aspect ratio
          }

          // Set image position
          img.set({
            left: 50,
            top: 50,
            selectable: true,
          });

          // Add the image to the canvas and render it
          canvas.add(img);
          canvas.setActiveObject(img);
          canvas.renderAll();
        } catch (error) {
          console.error("Error loading image: ", error);
        }
      }
    };

    loadImage(); // Call the image loader function
  }, [imageUrl, canvas]);

  // Function to add a text layer to the canvas
  const addTextLayer = () => {
    if (canvas) {
      const textbox = new Textbox('Edit me', {
        left: 100,
        top: 200,
        width: 200,
        fontSize: 20,
        fill: 'black',
        editable: true,
        selectable: true,
      });

      // Add the textbox to the canvas
      canvas.add(textbox);
      canvas.setActiveObject(textbox); // Set it as active object
      canvas.renderAll(); // Re-render the canvas
    }
  };

  // Function to add a Circle shape to the canvas
  const addCircle = () => {
    if (canvas) {
      const circle = new Circle({
        radius: 50,
        left: 100,
        top: 100,
        fill: 'blue',
        selectable: true,
      });

      // Add the circle to the canvas
      canvas.add(circle);
      canvas.setActiveObject(circle);
      canvas.renderAll();
    }
  };

  // Function to add a Rectangle shape to the canvas
  const addRectangle = () => {
    if (canvas) {
      const rectangle = new Rect({
        left: 150,
        top: 150,
        fill: 'green',
        width: 100,
        height: 60,
        selectable: true,
      });

      // Add the rectangle to the canvas
      canvas.add(rectangle);
      canvas.setActiveObject(rectangle);
      canvas.renderAll();
    }
  };

  // Function to add a Triangle shape to the canvas
  const addTriangle = () => {
    if (canvas) {
      const triangle = new Triangle({
        left: 200,
        top: 200,
        fill: 'yellow',
        width: 100,
        height: 100,
        selectable: true,
      });

      // Add the triangle to the canvas
      canvas.add(triangle);
      canvas.setActiveObject(triangle);
      canvas.renderAll();
    }
  };

  // Function to add a Polygon (Hexagon) shape to the canvas
  const addPolygon = () => {
    if (canvas) {
      const points = [
        { x: 50, y: 0 },
        { x: 100, y: 30 },
        { x: 100, y: 80 },
        { x: 50, y: 100 },
        { x: 0, y: 80 },
        { x: 0, y: 30 }
      ];
      const polygon = new Polygon(points, {
        left: 250,
        top: 250,
        fill: 'red',
        selectable: true,
      });

      // Add the polygon to the canvas
      canvas.add(polygon);
      canvas.setActiveObject(polygon);
      canvas.renderAll();
    }
  };

  // Function to download the canvas content as an image
  const downloadImage = () => {
    if (canvas) {
      const dataURL = canvas.toDataURL("image/png"); // Convert the canvas to a PNG data URL
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "canvas_image.png"; // Set the filename for the download
      link.click(); // Programmatically trigger the download
    }
  };

  return (
    <div>
      <h2>Add Caption Page</h2>
      <div style={{ display: "flex" }}>
        <div>
          <canvas ref={canvasRef} style={{ border: "1px solid black" }} />
        </div>
      </div>
      <div style={{ marginTop: "20px" }}>
        {/* Add Shape Buttons */}
        <button onClick={addTextLayer}>Add Text</button>
        <button onClick={addCircle} style={{ marginLeft: "10px" }}>Add Circle</button>
        <button onClick={addRectangle} style={{ marginLeft: "10px" }}>Add Rectangle</button>
        <button onClick={addTriangle} style={{ marginLeft: "10px" }}>Add Triangle</button>
        <button onClick={addPolygon} style={{ marginLeft: "10px" }}>Add Polygon</button>
        {/* Download Button */}
        <button onClick={downloadImage} style={{ marginLeft: "10px" }}>Download Image</button>
      </div>
    </div>
  );
};

export default AddCaptionPage;
