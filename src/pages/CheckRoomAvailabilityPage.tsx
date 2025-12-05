import React, { useState, useEffect, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import background from "../assets/background.jpg";

const CheckRoomAvailabilityPage: React.FC = () => {
  const ALL_ROOMS: string[] = ["123", "456", "789"];

  const ROOM_DETAILS: Record<
    string,
    {
      id: number;
      name: string;
      capacity: number;
      type: string;
      doctors: string[];
    }
  > = {
    "123": {
      id: 0,
      name: "123",
      capacity: 2,
      type: "ICU",
      doctors: ["Dr. Adams", "Dr. Baker"],
    },
    "456": {
      id: 1,
      name: "456",
      capacity: 3,
      type: "General",
      doctors: ["Dr. Clark"],
    },
    "789": {
      id: 2,
      name: "789",
      capacity: 1,
      type: "Private",
      doctors: ["Dr. Davis", "Dr. Evans"],
    },
  };

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

    const roomData = ROOM_DETAILS[selectedRoom];
    if (!roomData) {
      alert("Invalid room selected.");
      return;
    }

    navigate("/booking-confirmation", {
      state: {
        room: roomData,
      },
    });
  };

  const handleRoomInput = (e: ChangeEvent<HTMLInputElement>) => {
    setRoomNumber(e.target.value);
  };

  const handleAvailableRoomChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setAvailableRoom(e.target.value);
  };

  // Remove occupied room handler
  const handleRemoveOccupiedRoom = (room: string) => {
    if (window.confirm(`Remove occupied room ${room}?`)) {
      const updatedRooms = occupiedRooms.filter((r) => r !== room);
      setOccupiedRooms(updatedRooms);
      localStorage.setItem("occupiedRooms", JSON.stringify(updatedRooms));
    }
  };

  const allRoomsOccupied = computedAvailableRooms.length === 0;

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
            placeholder={allRoomsOccupied ? "All rooms are occupied" : "Enter room number"}
            disabled={allRoomsOccupied}
            style={{
              width: "94.5%",
              maxWidth: "400px",
              padding: 10,
              fontSize: "1rem",
              borderRadius: 6,
              border: "1.5px solid #bbb",
              backgroundColor: allRoomsOccupied ? "#eee" : "white",
              cursor: allRoomsOccupied ? "not-allowed" : "text",
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
            disabled={allRoomsOccupied}
            style={{
              width: "100%",
              padding: 10,
              fontSize: "1rem",
              borderRadius: 6,
              border: "1.5px solid #bbb",
              backgroundColor: allRoomsOccupied ? "#eee" : "white",
              cursor: allRoomsOccupied ? "not-allowed" : "pointer",
            }}
          >
            {allRoomsOccupied ? (
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
            style={{
              marginBottom: 8,
              fontSize: "1rem",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "10px",
              color: "#333",
            }}
          >
            Occupied Room(s)
            <span
              aria-label={`${occupiedRooms.length} rooms occupied`}
              style={{
                backgroundColor: "#dc3545",
                color: "white",
                borderRadius: "9999px",
                padding: "2px 10px",
                fontSize: "0.85rem",
                fontWeight: "700",
              }}
            >
              {occupiedRooms.length}
            </span>
          </label>

          {occupiedRooms.length === 0 ? (
            <p
              style={{
                fontStyle: "italic",
                color: "#666",
                padding: "8px",
                borderRadius: "6px",
                backgroundColor: "#f8f9fa",
                textAlign: "center",
                userSelect: "none",
              }}
            >
              No occupied rooms.
            </p>
          ) : (
            <ul
              style={{
                listStyleType: "none",
                paddingLeft: 0,
                margin: 0,
                maxHeight: 150,
                overflowY: "auto",
                border: "1px solid #ddd",
                borderRadius: "8px",
                backgroundColor: "#fff0f1",
                boxShadow: "inset 0 0 10px rgba(220, 53, 69, 0.1)",
              }}
              aria-label="List of occupied rooms"
            >
              {occupiedRooms.map((room) => (
                <li
                  key={room}
                  style={{
                    margin: 0,
                    padding: "8px 16px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px solid #f1b0b7",
                    fontWeight: 600,
                    color: "#721c24",
                    fontSize: "0.95rem",
                  }}
                >
                  <span>{room}</span>
                  <button
                    onClick={() => handleRemoveOccupiedRoom(room)}
                    aria-label={`Remove occupied room ${room}`}
                    title={`Remove occupied room ${room}`}
                    style={{
                      backgroundColor: "#dc3545",
                      border: "none",
                      color: "#fff",
                      padding: "4px 10px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontWeight: "600",
                      fontSize: "0.8rem",
                      transition: "background-color 0.3s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#b02a37")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#dc3545")}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          disabled={allRoomsOccupied}
          style={{
            backgroundColor: allRoomsOccupied ? "#94d3a2" : "#28a745",
            color: "white",
            padding: 10,
            fontSize: "1rem",
            border: "none",
            borderRadius: 8,
            cursor: allRoomsOccupied ? "not-allowed" : "pointer",
            boxShadow: "0 3px 8px rgba(0,0,0,0.2)",
            transition: "0.3s",
          }}
          onMouseEnter={(e) => {
            if (!allRoomsOccupied) e.currentTarget.style.backgroundColor = "#1e7e34";
          }}
          onMouseLeave={(e) => {
            if (!allRoomsOccupied) e.currentTarget.style.backgroundColor = "#28a745";
          }}
          aria-label="Search room availability"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default CheckRoomAvailabilityPage;
