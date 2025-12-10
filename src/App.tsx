import React, { useState, useEffect } from "react";

type Room = {
  id: number;
  room_number: string;
  capacity: number;
  doctors: string[];
};

function RoomAvailability() {
  const [checkInDate, setCheckInDate] = useState<string>("");
  const [checkOutDate, setCheckOutDate] = useState<string>("");
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const rooms: Room[] = [
    { id: 1, room_number: "Single Room", capacity: 1, doctors: ["Dr. Smith", "Dr. Lee"] },
    { id: 2, room_number: "Double Room", capacity: 2, doctors: ["Dr. Johnson"] },
    { id: 3, room_number: "Suite", capacity: 4, doctors: ["Dr. Patel", "Dr. Nguyen", "Dr. Brown"] },
  ];

  useEffect(() => {
    if (checkInDate && checkOutDate) {
      setAvailableRooms(rooms);
    } else {
      setAvailableRooms([]);
    }
  }, [checkInDate, checkOutDate]);

  const handleSelectRoom = (room: Room) => {
    setSelectedRoom(room);
  };

  return (
    <div>
      <h2>Check Room Availability</h2>

      <label>
        Check-in Date:{" "}
        <input
          type="date"
          value={checkInDate}
          onChange={(e) => setCheckInDate(e.target.value)}
        />
      </label>

      <label>
        Check-out Date:{" "}
        <input
          type="date"
          value={checkOutDate}
          onChange={(e) => setCheckOutDate(e.target.value)}
        />
      </label>

      <h3>Available Rooms</h3>
      {availableRooms.length === 0 && <p>No rooms available for selected dates.</p>}
      <ul>
        {availableRooms.map((room) => (
          <li key={room.id}>
            <button onClick={() => handleSelectRoom(room)}>
              {room.room_number} - Capacity: {room.capacity}
            </button>
            <p>
              Assigned Doctors: {room.doctors.length > 0 ? room.doctors.join(", ") : "None"}
            </p>
          </li>
        ))}
      </ul>

      {selectedRoom && (
        <div>
          <h4>Selected Room:</h4>
          <p>{selectedRoom.room_number}</p>
          <p>
            Doctors: {selectedRoom.doctors.length > 0 ? selectedRoom.doctors.join(", ") : "None"}
          </p>
        </div>
      )}
    </div>
  );
}

export default RoomAvailability;
