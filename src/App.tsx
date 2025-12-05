import React, { useState } from "react";
import "./RoomAvailability.css";

type Room = {
  id: number;
  name: string;
  capacity: number;
  doctors: string[];
};

export default function RoomAvailability() {
  const [rooms, setRooms] = useState<Room[]>([
    { id: 1, name: "Single Room", capacity: 1, doctors: ["Dr. Smith", "Dr. Lee"] },
    { id: 2, name: "Double Room", capacity: 2, doctors: ["Dr. Johnson"] },
    { id: 3, name: "Suite", capacity: 4, doctors: ["Dr. Patel", "Dr. Nguyen", "Dr. Brown"] },
  ]);

  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  // CRUD States
  const [newRoom, setNewRoom] = useState({ name: "", capacity: 1, doctors: "" });
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  const handleSearch = () => {
    if (checkInDate && checkOutDate) {
      setAvailableRooms(rooms);
    } else {
      setAvailableRooms([]);
    }
  };

  const addRoom = () => {
    const room: Room = {
      id: Date.now(),
      name: newRoom.name,
      capacity: Number(newRoom.capacity),
      doctors: newRoom.doctors.split(",").map((d) => d.trim()),
    };

    setRooms([...rooms, room]);
    setNewRoom({ name: "", capacity: 1, doctors: "" });
  };

  const updateRoom = () => {
    if (!editingRoom) return;

    setRooms(
      rooms.map((r) => (r.id === editingRoom.id ? editingRoom : r))
    );
    setEditingRoom(null);
  };

  const deleteRoom = (id: number) => {
    setRooms(rooms.filter((r) => r.id !== id));
  };

  return (
    <div className="page">
      <div className="card">
        <h1 className="title">Check Room Availability</h1>

        <div className="date-row">
          <div className="field">
            <label>Check-in Date</label>
            <input type="date" value={checkInDate} onChange={(e) => setCheckInDate(e.target.value)} />
          </div>

          <div className="field">
            <label>Check-out Date</label>
            <input type="date" value={checkOutDate} onChange={(e) => setCheckOutDate(e.target.value)} />
          </div>
        </div>

        <button className="btn" onClick={handleSearch}>Search</button>
      </div>

      <h2 className="section-title">Available Rooms</h2>

      <div className="room-list">
        {availableRooms.length === 0 && (
          <p className="empty-msg">No rooms available for selected dates.</p>
        )}

        {availableRooms.map((room) => (
          <div className="room-card" key={room.id}>
            <h3>{room.name}</h3>
            <p>Capacity: {room.capacity}</p>
            <p>Doctors: {room.doctors.join(", ")}</p>

            <button className="select-btn" onClick={() => setSelectedRoom(room)}>Select</button>

            <button className="edit-btn" onClick={() => setEditingRoom(room)}>Edit</button>

            <button className="delete-btn" onClick={() => deleteRoom(room.id)}>Delete</button>
          </div>
        ))}
      </div>

      {selectedRoom && (
        <div className="selected-box">
          <h3>Selected Room</h3>
          <p>{selectedRoom.name}</p>
          <p>Doctors: {selectedRoom.doctors.join(", ")}</p>
        </div>
      )}

      {/* Add Room Form */}
      <div className="card add-room-card">
        <h2>Add New Room</h2>

        <input
          className="input"
          placeholder="Room Name"
          value={newRoom.name}
          onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
        />
        <input
          className="input"
          type="number"
          placeholder="Capacity"
          value={newRoom.capacity}
          onChange={(e) => setNewRoom({ ...newRoom, capacity: Number(e.target.value) })}
        />
        <input
          className="input"
          placeholder="Doctors (comma separated)"
          value={newRoom.doctors}
          onChange={(e) => setNewRoom({ ...newRoom, doctors: e.target.value })}
        />

        <button className="btn" onClick={addRoom}>Add Room</button>
      </div>

      {/* Edit Room Form */}
      {editingRoom && (
        <div className="card edit-room-card">
          <h2>Edit Room</h2>

          <input
            className="input"
            value={editingRoom.name}
            onChange={(e) => setEditingRoom({ ...editingRoom, name: e.target.value })}
          />

          <input
            className="input"
            type="number"
            value={editingRoom.capacity}
            onChange={(e) => setEditingRoom({ ...editingRoom, capacity: Number(e.target.value) })}
          />

          <input
            className="input"
            value={editingRoom.doctors.join(", ")}
            onChange={(e) =>
              setEditingRoom({
                ...editingRoom,
                doctors: e.target.value.split(",").map((d) => d.trim()),
              })
            }
          />

          <button className="btn" onClick={updateRoom}>Save Changes</button>
        </div>
      )}
    </div>
  );
}

