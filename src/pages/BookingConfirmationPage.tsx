import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

type Room = {
  id: number;
  name: string;
  capacity: number;
  type: string;
  doctors: string[];
};

export default function BookingConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const room: Room | null = location.state?.room || null;

  if (!room) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          backgroundColor: "#f0f3f7",
          color: "#7f8c8d",
          fontSize: "1rem",
          padding: 12,
          textAlign: "center",
        }}
      >
        No room selected. Please go back and select a room.
      </div>
    );
  }

  const handleConfirmBooking = () => {
    const storedOccupied = localStorage.getItem("occupiedRooms");
    const occupiedRooms: string[] = storedOccupied ? JSON.parse(storedOccupied) : [];

    if (!occupiedRooms.includes(room.name)) {
      occupiedRooms.push(room.name);
      localStorage.setItem("occupiedRooms", JSON.stringify(occupiedRooms));
    }

    alert(`Booking confirmed for Room ${room.name}!`);
    navigate("/");
  };

  const handleCancel = () => navigate(-1);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#ecf0f1",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <main
        role="main"
        style={{
          backgroundColor: "#fff",
          borderRadius: 12,
          boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
          maxWidth: 360,
          width: "100%",
          padding: 20,
          display: "flex",
          flexDirection: "column",
          gap: 16,
          textAlign: "center",
        }}
      >
        <h1
          style={{
            margin: 0,
            color: "#2c3e50",
            fontWeight: 700,
            fontSize: "1.8rem",
            letterSpacing: "0.04em",
          }}
        >
          Confirm Your Booking
        </h1>

        <section
          style={{
            backgroundColor: "#f9f9f9",
            padding: 16,
            borderRadius: 10,
            boxShadow: "inset 0 0 6px rgba(0,0,0,0.05)",
            textAlign: "left",
            color: "#34495e",
            fontSize: "0.9rem",
            lineHeight: 1.4,
          }}
        >
          <p>
            <strong>Room Number:</strong> {room.name}
          </p>
          <p>
            <strong>Capacity:</strong> {room.capacity}
          </p>
          <p>
            <strong>Type:</strong> {room.type}
          </p>
          <p>
            <strong>Doctors Assigned:</strong> {room.doctors.join(", ")}
          </p>
        </section>

        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button
            onClick={handleConfirmBooking}
            style={buttonStyle("#27ae60", "#1e8449")}
            aria-label="Confirm booking"
          >
            Confirm Booking
          </button>

          <button
            onClick={handleCancel}
            style={buttonStyle("#e74c3c", "#c0392b")}
            aria-label="Cancel booking"
          >
            Cancel
          </button>
        </div>
      </main>
    </div>
  );
}

// Helper function for button styles with hover effects
function buttonStyle(bgColor: string, hoverColor: string): React.CSSProperties {
  return {
    flex: 1,
    backgroundColor: bgColor,
    border: "none",
    color: "white",
    padding: "10px 0",
    fontSize: "1rem",
    fontWeight: 700,
    borderRadius: 10,
    cursor: "pointer",
    boxShadow: `0 4px 12px ${hexToRgba(bgColor, 0.5)}`,
    transition: "background-color 0.3s ease",
    userSelect: "none",
  };
}

// Utility to convert hex color to rgba string for shadows
function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}
