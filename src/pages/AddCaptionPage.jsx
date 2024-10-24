import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { FabricImage, Canvas, Textbox, Circle, Rect, Triangle, Polygon } from 'fabric'; // Import latest Fabric.js

const AddCaptionPage = () => {
  const { id } = useParams(); 
  const canvasRef = useRef(null); 
  const [canvas, setCanvas] = useState(null); 
  const [imageUrl, setImageUrl] = useState(null); 
  const [objects, setObjects] = useState([]); // Store canvas objects for the layers panel
  const API_KEY = "46697526-a622015f37acfda96112752b6"; 

  // Fetch image data based on ID
  useEffect(() => {
    const fetchImage = async () => {
      const url = `https://pixabay.com/api/?key=${API_KEY}&id=${id}`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.hits.length > 0) {
          const image = data.hits[0];
          setImageUrl(image.largeImageURL);
        } else {
          console.error("Image not found");
        }
      } catch (error) {
        console.error("Error fetching image:", error);
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
      fabricCanvas.dispose();
    };
  }, []);

  // Add the image to the Fabric.js canvas when the image URL is available
  useEffect(() => {
    const loadImage = async () => {
      if (imageUrl && canvas) {
        canvas.clear();
        try {
          const img = await FabricImage.fromURL(imageUrl, { crossOrigin: "anonymous" });
          img.scaleToWidth(500);
          img.set({ left: 50, top: 50, selectable: true });
          canvas.add(img);
          canvas.setActiveObject(img);
          canvas.renderAll();
          updateLayersPanel(); // Update layers after image is added
        } catch (error) {
          console.error("Error loading image: ", error);
        }
      }
    };
    loadImage();
  }, [imageUrl, canvas]);

  // Function to update the layers panel
  const updateLayersPanel = () => {
    if (canvas) {
      setObjects(canvas.getObjects()); // Update object list
    }
  };

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
      canvas.add(textbox);
      canvas.setActiveObject(textbox);
      canvas.renderAll();
      updateLayersPanel();
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
      canvas.add(circle);
      canvas.setActiveObject(circle);
      canvas.renderAll();
      updateLayersPanel();
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
      canvas.add(rectangle);
      canvas.setActiveObject(rectangle);
      canvas.renderAll();
      updateLayersPanel();
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
      canvas.add(triangle);
      canvas.setActiveObject(triangle);
      canvas.renderAll();
      updateLayersPanel();
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
      canvas.add(polygon);
      canvas.setActiveObject(polygon);
      canvas.renderAll();
      updateLayersPanel();
    }
  };

  // Function to reorder layers based on new order
  const handleLayerReorder = (dragIndex, hoverIndex) => {
    const newObjects = [...objects];
    const [draggedObject] = newObjects.splice(dragIndex, 1); // Remove dragged item
    newObjects.splice(hoverIndex, 0, draggedObject); // Insert it in new position
    newObjects.forEach((obj, index) => canvas.moveTo(obj, index)); // Update z-indexes
    setObjects(newObjects); // Update state
    canvas.renderAll(); // Re-render canvas
  };

  // Function to download the canvas content as an image
  const downloadImage = () => {
    if (canvas) {
      const dataURL = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "canvas_image.png";
      link.click();
    }
  };

  return (
    <div>
      <h2>Add Caption Page</h2>
      <div style={{ display: "flex" }}>
        <div>
          <canvas ref={canvasRef} style={{ border: "1px solid black" }} />
        </div>
        <div style={{ marginLeft: "20px" }}>
          <h3>Layers Panel</h3>
          <ul>
            {objects.map((obj, index) => (
              <li key={index}>
                <div draggable 
                  onDragStart={(e) => e.dataTransfer.setData("dragIndex", index)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleLayerReorder(parseInt(e.dataTransfer.getData("dragIndex")), index)}>
                  {obj.type} (Layer {index + 1})
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div style={{ marginTop: "20px" }}>
        <button onClick={addTextLayer}>Add Text</button>
        <button onClick={addCircle} style={{ marginLeft: "10px" }}>Add Circle</button>
        <button onClick={addRectangle} style={{ marginLeft: "10px" }}>Add Rectangle</button>
        <button onClick={addTriangle} style={{ marginLeft: "10px" }}>Add Triangle</button>
        <button onClick={addPolygon} style={{ marginLeft: "10px" }}>Add Polygon</button>
        <button onClick={downloadImage} style={{ marginLeft: "10px" }}>Download Image</button>
      </div>
    </div>
  );
};

export default AddCaptionPage;
