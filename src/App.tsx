import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AvailableRoomsPage from "./pages/AvailableRoomsPage";
import BookingConfirmationPage from "./pages/BookingConfirmationPage";
import CheckRoomAvailabilityPage from "./pages/CheckRoomAvailabilityPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default page */}
        <Route path="/" element={<CheckRoomAvailabilityPage />} />

        {/* Rooms page */}
        <Route path="/rooms" element={<AvailableRoomsPage />} />

        {/* After selecting a room */}
        <Route path="/booking-confirmation" element={<BookingConfirmationPage />} />
      </Routes>
    </Router>
  );
}

export default App;
