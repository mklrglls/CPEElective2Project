import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

type Room = {
  id: number;
  room_number: string; // match backend column name
  capacity: number;
  type: string;
  doctors: string[]; // array of doctor names
  available: number; // 1 or 0
};

const BookingConfirmationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // id corresponds to room_number from URL
  const navigate = useNavigate();

  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    if (!id) {
      setError("No room ID provided.");
      setLoading(false);
      return;
    }

    async function fetchRoom() {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("You must be logged in to view this page.");
        navigate("/");
        return;
      }

      try {
        const response = await fetch(`http://localhost:4000/rooms/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch room details.");
        }

        const data = await response.json();

        const normalizedRoom: Room = {
          id: data.id ?? 0,
          room_number: data.room_number || "",
          capacity: data.capacity || 1,
          type: data.type || "",
          doctors:
            typeof data.doctors === "string"
              ? JSON.parse(data.doctors)
              : Array.isArray(data.doctors)
              ? data.doctors
              : [],
          available: data.available,
        };

        setRoom(normalizedRoom);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchRoom();
  }, [id, navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setRoom((prev) =>
      prev
        ? {
            ...prev,
            [name]: name === "capacity" ? Number(value) : value,
          }
        : null
    );
  };

  const handleDoctorsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRoom((prev) =>
      prev ? { ...prev, doctors: value.split(",").map((d) => d.trim()) } : null
    );
  };

  const handleConfirmBooking = async () => {
    if (!room) return;
    setBookingLoading(true);

    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("You must be logged in to book a room.");
      navigate("/");
      setBookingLoading(false);
      return;
    }

    try {
      // Fetch all rooms to check availability
      const allRoomsResponse = await fetch("http://localhost:4000/rooms/all", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!allRoomsResponse.ok) throw new Error("Failed to fetch rooms");

      const rooms = await allRoomsResponse.json();
      const roomData = rooms.find(
        (r: any) => r.room_number === room.room_number
      );

      if (!roomData) {
        alert("Room not found.");
        setBookingLoading(false);
        return;
      }

      if (roomData.available !== 1) {
        alert("Room is already occupied.");
        setBookingLoading(false);
        return;
      }

      // Update room details if changed
      const updateResponse = await fetch(
        `http://localhost:4000/rooms/${room.room_number}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            capacity: room.capacity,
            type: room.type,
            doctors: room.doctors,
          }),
        }
      );

      if (!updateResponse.ok)
        throw new Error("Failed to update room details");

      // Mark room as occupied
      const bookingResponse = await fetch(
        `http://localhost:4000/rooms/${room.room_number}/make-occupied`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!bookingResponse.ok) throw new Error("Failed to book room");

      alert("Room booked successfully!");
      navigate("/", { replace: true });
    } catch (error: any) {
      alert(error.message);
    } finally {
      setBookingLoading(false);
    }
  };

  const handleCancel = () => navigate(-1);

  if (loading) {
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
        Loading room details...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          backgroundColor: "#f0f3f7",
          color: "red",
          fontSize: "1rem",
          padding: 12,
          textAlign: "center",
        }}
      >
        {error}
      </div>
    );
  }

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
        No room found. Please go back and select a room.
      </div>
    );
  }

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
          maxWidth: 400,
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
          }}
        >
          Confirm Your Booking
        </h1>

        <section
          style={{
            backgroundColor: "#f9f9f9",
            padding: 16,
            borderRadius: 10,
            textAlign: "left",
          }}
        >
          <label>
            <strong>Room Number:</strong>
            <input
              type="text"
              name="room_number"
              value={room.room_number}
              style={{ width: "100%", marginTop: 6, padding: 8, fontSize: 16 }}
              disabled
            />
          </label>

          <label style={{ marginTop: 12, display: "block" }}>
            <strong>Capacity:</strong>
            <input
              type="number"
              name="capacity"
              min={1}
              value={room.capacity}
              onChange={handleChange}
              style={{ width: "100%", marginTop: 6, padding: 8, fontSize: 16 }}
            />
          </label>

          <label style={{ marginTop: 12, display: "block" }}>
            <strong>Type:</strong>
            <input
              type="text"
              name="type"
              value={room.type}
              onChange={handleChange}
              style={{ width: "100%", marginTop: 6, padding: 8, fontSize: 16 }}
            />
          </label>

          <label style={{ marginTop: 12, display: "block" }}>
            <strong>Doctors (comma separated):</strong>
            <input
              type="text"
              name="doctors"
              value={room.doctors.join(", ")}
              onChange={handleDoctorsChange}
              style={{ width: "100%", marginTop: 6, padding: 8, fontSize: 16 }}
            />
          </label>
        </section>

        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={handleConfirmBooking}
            style={{
              flex: 1,
              backgroundColor: "#27ae60",
              color: "white",
              padding: "10px 0",
              borderRadius: 10,
              border: "none",
              fontWeight: "bold",
              cursor: bookingLoading ? "not-allowed" : "pointer",
            }}
            disabled={bookingLoading}
          >
            {bookingLoading ? "Booking..." : "Confirm"}
          </button>

          <button
            onClick={handleCancel}
            style={{
              flex: 1,
              backgroundColor: "#e74c3c",
              color: "white",
              padding: "10px 0",
              borderRadius: 10,
              border: "none",
              fontWeight: "bold",
              cursor: bookingLoading ? "not-allowed" : "pointer",
            }}
            disabled={bookingLoading}
          >
            Cancel
          </button>
        </div>
      </main>
    </div>
  );
};

export default BookingConfirmationPage;
