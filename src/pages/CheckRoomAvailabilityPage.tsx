import React, { useState, useEffect, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import background from "../assets/background.jpg";

const CheckRoomAvailabilityPage: React.FC = () => {
  const ALL_ROOMS: string[] = ["123", "456", "789"];

  const [roomNumber, setRoomNumber] = useState<string>("");
  const [availableRoom, setAvailableRoom] = useState<string>("");
  const [occupiedRooms, setOccupiedRooms] = useState<string[]>([]);

  const navigate = useNavigate();

  // Load occupied rooms from localStorage once on mount
  useEffect(() => {
    const storedOccupied = localStorage.getItem("occupiedRooms");
    if (storedOccupied) {
      setOccupiedRooms(JSON.parse(storedOccupied));
    }
  }, []);

  // Compute available rooms excluding occupied ones
  const computedAvailableRooms = ALL_ROOMS.filter(
    (room) => !occupiedRooms.includes(room)
  );

  // When searching, navigate to Booking Confirmation page with selected room
  const handleSearch = () => {
    const selectedRoom = availableRoom || roomNumber;
    if (!selectedRoom) {
      alert("Please select or enter a room number.");
      return;
    }
    navigate("/booking-confirmation", {
      state: {
        room: {
          id: ALL_ROOMS.indexOf(selectedRoom),
          name: selectedRoom,
          capacity: 4, // Example static data or fetch real data
          type: "Standard",
          doctors: ["Dr. Smith", "Dr. Jones"],
        },
      },
    });
  };

  const handleRoomInput = (e: ChangeEvent<HTMLInputElement>) => {
    setRoomNumber(e.target.value);
  };

  const handleAvailableRoomChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setAvailableRoom(e.target.value);
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.4)",
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "90%",
          maxWidth: "400px",
          backgroundColor: "rgba(255,255,255,0.95)",
          borderRadius: "14px",
          padding: "24px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <h1
          style={{
            margin: 0,
            color: "#222",
            fontSize: "1.6rem",
            fontWeight: 700,
            textAlign: "center",
          }}
        >
          Check Room Availability
        </h1>

        {/* Room Number Input */}
        <div>
          <label
            htmlFor="roomNumber"
            style={{ marginBottom: 6, fontSize: "1rem", fontWeight: 600, display: "block" }}
          >
            Room Number (optional)
          </label>
          <input
            id="roomNumber"
            type="text"
            value={roomNumber}
            onChange={handleRoomInput}
            placeholder="Enter room number"
            style={{
              width: "94.5%",
              maxWidth: "400px",
              padding: 10,
              fontSize: "1rem",
              borderRadius: 6,
              border: "1.5px solid #bbb",
            }}
          />
        </div>

        {/* Available Rooms Dropdown */}
        <div>
          <label
            htmlFor="availableRoom"
            style={{ marginBottom: 6, fontSize: "1rem", fontWeight: 600, display: "block" }}
          >
            Available Room(s)
          </label>
          <select
            id="availableRoom"
            value={availableRoom}
            onChange={handleAvailableRoomChange}
            disabled={computedAvailableRooms.length === 0}
            style={{
              width: "100%",
              padding: 10,
              fontSize: "1rem",
              borderRadius: 6,
              border: "1.5px solid #bbb",
              backgroundColor: computedAvailableRooms.length === 0 ? "#eee" : "white",
              cursor: computedAvailableRooms.length === 0 ? "not-allowed" : "pointer",
            }}
          >
            {computedAvailableRooms.length === 0 ? (
              <option>No available rooms</option>
            ) : (
              <>
                <option value="">Select a room</option>
                {computedAvailableRooms.map((room) => (
                  <option key={room} value={room}>
                    {room}
                  </option>
                ))}
              </>
            )}
          </select>
        </div>

        {/* Occupied Rooms List (stacked) */}
        <div>
          <label
            style={{ marginBottom: 8, fontSize: "1rem", fontWeight: 600, display: "block" }}
          >
            Occupied Room(s)
          </label>

          {occupiedRooms.length === 0 ? (
            <p style={{ fontStyle: "italic", color: "#666" }}>No occupied rooms.</p>
          ) : (
            <ul
              style={{
                listStyleType: "disc",
                paddingLeft: 20,
                margin: 0,
                maxHeight: 150,
                overflowY: "auto",
              }}
            >
              {occupiedRooms.map((room) => (
                <li
                  key={room}
                  style={{
                    marginBottom: 8,
                    padding: "6px 8px",
                    backgroundColor: "#f8d7da",
                    borderRadius: 6,
                    color: "#721c24",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  }}
                >
                  {room}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          style={{
            backgroundColor: "#28a745",
            color: "white",
            padding: 10,
            fontSize: "1rem",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            boxShadow: "0 3px 8px rgba(0,0,0,0.2)",
            transition: "0.3s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1e7e34")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#28a745")}
          aria-label="Search room availability"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default CheckRoomAvailabilityPage;
