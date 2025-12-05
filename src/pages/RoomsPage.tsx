import React, { useState, useEffect } from "react";

interface Room {
  id: number;
  name: string;
  capacity: number;
  doctors: string[];
}

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    capacity: "",
    doctors: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setRooms([
      { id: 1, name: "Single Room", capacity: 1, doctors: ["Dr. Smith", "Dr. Lee"] },
      { id: 2, name: "Double Room", capacity: 2, doctors: ["Dr. Johnson"] },
    ]);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCreate = () => {
    const newRoom: Room = {
      id: Date.now(),
      name: formData.name,
      capacity: Number(formData.capacity),
      doctors: formData.doctors.split(",").map((d) => d.trim()),
    };

    setRooms([...rooms, newRoom]);
    resetForm();
  };

  const openEdit = (room: Room) => {
    setIsEditing(true);
    setShowForm(true);

    setFormData({
      id: room.id,
      name: room.name,
      capacity: room.capacity.toString(),
      doctors: room.doctors.join(", "),
    });
  };

  const handleUpdate = () => {
    setRooms(
      rooms.map((room) =>
        room.id === formData.id
          ? {
              ...room,
              name: formData.name,
              capacity: Number(formData.capacity),
              doctors: formData.doctors.split(",").map((d) => d.trim()),
            }
          : room
      )
    );

    resetForm();
  };

  const handleDelete = (id: number) => {
    setRooms(rooms.filter((room) => room.id !== id));
  };

  const resetForm = () => {
    setIsEditing(false);
    setShowForm(false);
    setFormData({ id: 0, name: "", capacity: "", doctors: "" });
  };

  return (
    <div className="container mt-4">
      <h2>Available Rooms</h2>

      <button
        className="btn btn-primary mb-3"
        onClick={() => {
          resetForm();
          setShowForm(true);
        }}
      >
        + Add Room
      </button>

      {showForm && (
        <div className="card p-3 mb-4">
          <h4>{isEditing ? "Edit Room" : "Create Room"}</h4>

          <input
            className="form-control mb-2"
            placeholder="Room Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />

          <input
            className="form-control mb-2"
            placeholder="Capacity"
            type="number"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
          />

          <input
            className="form-control mb-2"
            placeholder="Doctors (comma separated)"
            name="doctors"
            value={formData.doctors}
            onChange={handleChange}
          />

          <button
            className="btn btn-success me-2"
            onClick={isEditing ? handleUpdate : handleCreate}
          >
            {isEditing ? "Save Changes" : "Create Room"}
          </button>

          <button className="btn btn-secondary" onClick={() => setShowForm(false)}>
            Cancel
          </button>
        </div>
      )}

      {rooms.map((room) => (
        <div key={room.id} className="card p-3 mb-3">
          <h5>{room.name}</h5>
          <p>Capacity: {room.capacity}</p>
          <p>Doctors: {room.doctors.join(", ")}</p>

          <button className="btn btn-success me-2">Select</button>
          <button className="btn btn-warning me-2" onClick={() => openEdit(room)}>
            Edit
          </button>
          <button className="btn btn-danger" onClick={() => handleDelete(room.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
