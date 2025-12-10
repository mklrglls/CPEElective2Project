import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BookingConfirmationPage from "./pages/BookingConfirmationPage";
import CheckRoomAvailabilityPage from "./pages/CheckRoomAvailabilityPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default page */}
        <Route path="/" element={<CheckRoomAvailabilityPage />} />

        {/* After selecting a room - roomNumber is a URL param */}
        <Route path="/booking-confirmation/:id" element={<BookingConfirmationPage />} />
      </Routes>
    </Router>
  );
}

export default App;
