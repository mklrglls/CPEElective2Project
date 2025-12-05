import React, { useState, useEffect } from "react"; 
import { useLocation, useNavigate } from "react-router-dom";
import "./RoomAvailability.css";

type Room = {
  id: number;
  name: string; // room number
  capacity: number;
  type: string;
  doctors: string[];
};

export default function AvailableRoomsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { roomNumber } = location.state || {};

  const [availableRooms, setAvailableRooms] = useState<Room[]>([
    { id: 1, name: "123", capacity: 1, type: "Single", doctors: ["Dr. Smith", "Dr. Lee"] },
    { id: 2, name: "456", capacity: 2, type: "Double", doctors: ["Dr. Johnson"] },
    { id: 3, name: "789", capacity: 4, type: "Suite", doctors: ["Dr. Patel", "Dr. Nguyen", "Dr. Brown"] },
    { id: 4, name: "321", capacity: 3, type: "Deluxe", doctors: ["Dr. Carter", "Dr. Evans"] },
  ]);

  const [occupiedRooms, setOccupiedRooms] = useState<string[]>([]);

  useEffect(() => {
    const storedOccupied = localStorage.getItem("occupiedRooms");
    if (storedOccupied) {
      setOccupiedRooms(JSON.parse(storedOccupied));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("occupiedRooms", JSON.stringify(occupiedRooms));
  }, [occupiedRooms]);

  const filteredRooms = availableRooms.filter(room => {
    if (occupiedRooms.includes(room.name)) return false; // exclude occupied
    if (!roomNumber) return true;
    return room.name === roomNumber;
  });

  const handleSelectRoom = (room: Room) => {
    let newOccupiedRooms = [...occupiedRooms];
    if (!occupiedRooms.includes(room.name)) {
      newOccupiedRooms.push(room.name);
      setOccupiedRooms(newOccupiedRooms);
      localStorage.setItem("occupiedRooms", JSON.stringify(newOccupiedRooms));
    }

    navigate("/booking-confirmation", { state: { room } });
  };

  return (
    <div className="page">
      <h2 className="section-title">
        Available Rooms
      </h2>

      <div className="room-list" style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {filteredRooms.length > 0 ? (
          filteredRooms.map(room => (
            <div key={room.id} className="room-card" style={{ flex: "1 1 250px" }}>
              <h3>{room.name}</h3>
              <p>Capacity: {room.capacity}</p>
              <p>Type: {room.type}</p>
              <p>Doctors: {room.doctors.join(", ")}</p>

              <button
                className="select-btn"
                onClick={() => handleSelectRoom(room)}
              >
                Select
              </button>
            </div>
          ))
        ) : (
          <p style={{ marginTop: "20px", fontSize: "1.2rem" }}>
            No rooms available.
          </p>
        )}
      </div>
    </div>
  );
}
