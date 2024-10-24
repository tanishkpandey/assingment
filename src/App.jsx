import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AddCaptionPage from "./pages/AddCaptionPage";
const App = () => {
  return (
    <Router>
      <Routes>
        {/* Home page route (search page) */}
        <Route path="/" element={<HomePage />} />

        {/* Add Caption page route with dynamic image ID */}
        <Route path="/add-caption/:id" element={<AddCaptionPage />} />
      </Routes>
    </Router>
  );
};

export default App;
