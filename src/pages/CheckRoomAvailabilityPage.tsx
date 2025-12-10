import React, { useState, useEffect, ChangeEvent } from "react"; 
import { useNavigate, useLocation } from "react-router-dom";
import background from "../assets/background.jpg";

const BookingConfirmationPage = () => {
  const location = useLocation();
  const roomNumber = location.state?.roomNumber;

  return (
    <div>
      <h2>Booking Confirmation</h2>
      <p>You are about to book room: {roomNumber}</p>
      {/* Add your booking confirmation UI here */}
    </div>
  );
};

const CheckRoomAvailabilityPage: React.FC = () => {
  // Login states
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Rooms state
  const [roomsData, setRoomsData] = useState<any[]>([]);
  const [availableRooms, setAvailableRooms] = useState<string[]>([]);
  const [occupiedRooms, setOccupiedRooms] = useState<string[]>([]);

  // Selected rooms
  const [availableRoom, setAvailableRoom] = useState<string>("");
  const [roomNumber, setRoomNumber] = useState<string>("");

  // Tooltip for occupied rooms
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Tooltip for available rooms (NEW)
  const [hoveredAvailableRoom, setHoveredAvailableRoom] = useState<string | null>(null);
  const [availableTooltipPos, setAvailableTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const navigate = useNavigate();
  const location = useLocation();

  // On mount, load token from localStorage to persist login
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) setIsLoggedIn(true);
  }, []);

  // Login handler
  const handleLogin = async () => {
    setLoginError("");
    if (!username || !password) {
      setLoginError("Please enter username and password");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        setLoginError(data.error || "Login failed");
        return;
      }

      const data = await response.json();

      if (!data.token) {
        setLoginError("No token received from server.");
        return;
      }

      localStorage.setItem("authToken", data.token);
      setIsLoggedIn(true);
      setUsername("");
      setPassword("");
    } catch (error) {
      setLoginError("Login request failed. Please try again.");
    }
  };

  // Logout handler
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("authToken");
    setRoomsData([]);
    setAvailableRooms([]);
    setOccupiedRooms([]);
    setAvailableRoom("");
    setRoomNumber("");
  };

  // Fetch rooms
  const fetchRooms = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("You must be logged in to fetch rooms.");
        setIsLoggedIn(false);
        return;
      }
      
      const response = await fetch("http://localhost:4000/rooms/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error: ${response.statusText}`);
      }

      const data = await response.json();

      setRoomsData(data);
      setAvailableRooms(
        data.filter((r: any) => String(r.available) === "1").map((r: any) => r.room_number)
      );
      setOccupiedRooms(
        data.filter((r: any) => String(r.available) !== "1").map((r: any) => r.room_number)
      );
    } catch (error: any) {
      console.error("Error fetching rooms:", error);
      alert("Error fetching rooms data: " + (error.message || error));
    }
  };

  // Auto-fetch rooms when logged in or location changes
  useEffect(() => {
    if (isLoggedIn) {
      fetchRooms();

      if (location.state?.bookedRoom) {
        alert(`Room ${location.state.bookedRoom} booked successfully!`);
        window.history.replaceState({}, document.title);
      }
    }
  }, [location, isLoggedIn]);

  // Input handlers
  const handleAvailableRoomChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setAvailableRoom(e.target.value);
    setRoomNumber("");
  };

  const handleRoomInput = (e: ChangeEvent<HTMLInputElement>) => {
    setRoomNumber(e.target.value);
    setAvailableRoom("");
  };

  const handleSearch = () => {
    const selectedRoom = availableRoom || roomNumber.trim();
    if (!selectedRoom) {
      alert("Please select or enter a room number.");
      return;
    }
    const roomFromBackend = roomsData.find((r) => r.room_number === selectedRoom);
    if (!roomFromBackend) {
      alert("Room does not exist in the system.");
      return;
    }
    if (String(roomFromBackend.available) !== "1") {
      alert("Sorry, this room is currently occupied.");
      return;
    }

    // Navigate to confirmation page with room number in URL
    navigate(`/booking-confirmation/${selectedRoom}`);
  };

  // Handle clicking on available room in the list (select it)
  const handleAvailableRoomClick = (room: string) => {
    setAvailableRoom(room);
    setRoomNumber("");
  };

  // Handle mouse hover on occupied room for tooltip
  const handleOccupiedRoomMouseEnter = (room: string, e: React.MouseEvent<HTMLLIElement>) => {
    setHoveredRoom(room);
    setTooltipPos({ x: e.clientX + 10, y: e.clientY + 10 });
  };
  const handleOccupiedRoomMouseMove = (e: React.MouseEvent<HTMLLIElement>) => {
    setTooltipPos({ x: e.clientX + 10, y: e.clientY + 10 });
  };
  const handleOccupiedRoomMouseLeave = () => {
    setHoveredRoom(null);
  };

  // Handle mouse hover on available room for tooltip (NEW)
  const handleAvailableRoomMouseEnter = (room: string, e: React.MouseEvent<HTMLLIElement>) => {
    setHoveredAvailableRoom(room);
    setAvailableTooltipPos({ x: e.clientX + 10, y: e.clientY + 10 });
  };
  const handleAvailableRoomMouseMove = (e: React.MouseEvent<HTMLLIElement>) => {
    setAvailableTooltipPos({ x: e.clientX + 10, y: e.clientY + 10 });
  };
  const handleAvailableRoomMouseLeave = () => {
    setHoveredAvailableRoom(null);
  };

  // Find room details by room number
  const getRoomDetails = (roomNumber: string) => {
    return roomsData.find((r) => r.room_number === roomNumber);
  };

  // Login form UI
  if (!isLoggedIn) {
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
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            padding: "2rem",
            borderRadius: 12,
            boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
            width: 320,
            textAlign: "center",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          }}
        >
          <h2 style={{ marginBottom: "1.5rem", color: "#333" }}>Login</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              width: "100%",
              marginBottom: 16,
              padding: "10px 12px",
              fontSize: 16,
              borderRadius: 6,
              border: "1.5px solid #ccc",
              outline: "none",
              transition: "border-color 0.3s",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#007BFF")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#ccc")}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              marginBottom: 20,
              padding: "10px 12px",
              fontSize: 16,
              borderRadius: 6,
              border: "1.5px solid #ccc",
              outline: "none",
              transition: "border-color 0.3s",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#007BFF")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#ccc")}
          />
          <button
            onClick={handleLogin}
            style={{
              width: "100%",
              padding: "12px 0",
              fontSize: 16,
              borderRadius: 6,
              border: "none",
              backgroundColor: "#007BFF",
              color: "#fff",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "background-color 0.3s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0056b3")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#007BFF")}
          >
            Login
          </button>
          {loginError && (
            <p style={{ color: "red", marginTop: 15, fontWeight: "bold" }}>{loginError}</p>
          )}
        </div>
      </div>
    );
  }

  // Main logged-in UI
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "2rem",
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: "#f0f0f0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        overflowY: "auto",
        position: "relative",
      }}
    >
      <header
        style={{
          width: "100%",
          maxWidth: 900,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 30,
          padding: "0 1rem",
        }}
      >
        <h1 style={{ fontWeight: "bold", fontSize: "2rem" }}>Room Availability</h1>
        <button
          onClick={handleLogout}
          style={{
            padding: "8px 16px",
            fontSize: 14,
            borderRadius: 6,
            border: "none",
            backgroundColor: "#dc3545",
            color: "#fff",
            cursor: "pointer",
            transition: "background-color 0.3s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#a71d2a")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#dc3545")}
          title="Logout"
        >
          Logout
        </button>
      </header>

      <main
        style={{
          width: "100%",
          maxWidth: 900,
          backgroundColor: "rgba(0,0,0,0.5)",
          borderRadius: 12,
          padding: "2rem",
          boxShadow: "0 4px 30px rgba(0,0,0,0.3)",
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
        }}
      >
        <button
          onClick={fetchRooms}
          style={{
            alignSelf: "flex-start",
            padding: "10px 20px",
            fontSize: 16,
            fontWeight: "bold",
            backgroundColor: "#28a745",
            border: "none",
            borderRadius: 6,
            color: "#fff",
            cursor: "pointer",
            transition: "background-color 0.3s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1e7e34")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#28a745")}
        >
          Refresh Rooms List
        </button>

        <section
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "2rem",
            flexWrap: "wrap",
          }}
        >
          {/* Available Rooms List */}
          <div
            style={{
              flex: "1 1 45%",
              backgroundColor: "rgba(40, 167, 69, 0.2)",
              padding: "1rem",
              borderRadius: 8,
              minHeight: 150,
              color: "#d4edda",
              boxShadow: "inset 0 0 10px rgba(40,167,69,0.7)",
              userSelect: "none",
            }}
          >
            <h3 style={{ marginBottom: 12, borderBottom: "1px solid #d4edda", paddingBottom: 6 }}>
              Available Rooms
            </h3>
            {availableRooms.length === 0 ? (
              <p>No rooms available currently.</p>
            ) : (
              <ul
                style={{
                  listStyle: "none",
                  paddingLeft: 0,
                  maxHeight: 200,
                  overflowY: "auto",
                  cursor: "pointer",
                }}
              >
                {availableRooms.map((room) => (
                  <li
                    key={room}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "8px 12px",
                      marginBottom: 6,
                      backgroundColor: availableRoom === room ? "#1c7430" : "#218838",
                      borderRadius: 6,
                      transition: "background-color 0.3s",
                      color: "white",
                      fontWeight: availableRoom === room ? "bold" : "normal",
                      boxShadow: availableRoom === room ? "0 0 8px #155724" : "none",
                      cursor: "pointer",
                    }}
                    onClick={() => handleAvailableRoomClick(room)}
                    onMouseEnter={(e) => {
                      handleAvailableRoomMouseEnter(room, e);
                      e.currentTarget.style.backgroundColor = "#1c7430";
                    }}
                    onMouseMove={handleAvailableRoomMouseMove}
                    onMouseLeave={(e) => {
                      handleAvailableRoomMouseLeave();
                      if (availableRoom !== room) {
                        e.currentTarget.style.backgroundColor = "#218838";
                      }
                    }}
                  >
                    <span>{room}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent li click
                        if (window.confirm(`Are you sure you want to remove room ${room}?`)) {
                          setAvailableRooms((prev) => prev.filter((r) => r !== room));
                          if (availableRoom === room) setAvailableRoom("");
                        }
                      }}
                      style={{
                        marginLeft: 10,
                        backgroundColor: "#dc3545",
                        border: "none",
                        borderRadius: 4,
                        color: "white",
                        padding: "4px 8px",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                      title={`Remove room ${room}`}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Occupied Rooms List */}
          <div
            style={{
              flex: "1 1 45%",
              backgroundColor: "rgba(220, 53, 69, 0.2)",
              padding: "1rem",
              borderRadius: 8,
              minHeight: 150,
              color: "#f8d7da",
              boxShadow: "inset 0 0 10px rgba(220,53,69,0.7)",
              userSelect: "none",
              position: "relative",
            }}
          >
            <h3 style={{ marginBottom: 12, borderBottom: "1px solid #f8d7da", paddingBottom: 6 }}>
              Occupied Rooms
            </h3>
            {occupiedRooms.length === 0 ? (
              <p>No rooms are occupied.</p>
            ) : (
              <ul
                style={{
                  listStyle: "none",
                  paddingLeft: 0,
                  maxHeight: 200,
                  overflowY: "auto",
                  cursor: "default",
                }}
              >
                {occupiedRooms.map((room) => (
                  <li
                    key={room}
                    onMouseEnter={(e) => handleOccupiedRoomMouseEnter(room, e)}
                    onMouseMove={handleOccupiedRoomMouseMove}
                    onMouseLeave={handleOccupiedRoomMouseLeave}
                    style={{
                      padding: "8px 12px",
                      marginBottom: 6,
                      backgroundColor: "#c82333",
                      borderRadius: 6,
                      color: "white",
                      fontWeight: "bold",
                      position: "relative",
                    }}
                  >
                    {room}
                  </li>
                ))}
              </ul>
            )}

            {/* Tooltip for occupied rooms */}
            {hoveredRoom && (
              <div
                style={{
                  position: "fixed",
                  top: tooltipPos.y,
                  left: tooltipPos.x,
                  backgroundColor: "rgba(0,0,0,0.85)",
                  color: "white",
                  padding: "8px 12px",
                  borderRadius: 8,
                  boxShadow: "0 2px 10px rgba(0,0,0,0.5)",
                  pointerEvents: "none",
                  whiteSpace: "nowrap",
                  zIndex: 1000,
                  maxWidth: 280,
                }}
              >
                {(() => {
                  const details = getRoomDetails(hoveredRoom);
                  if (!details) return <span>No details available</span>;

                  return (
                    <div style={{ fontSize: 14 }}>
                      <div><strong>Room:</strong> {details.room_number}</div>
                      <div><strong>Capacity:</strong> {details.capacity}</div>
                      <div><strong>Type:</strong> {details.type}</div>
                      <div><strong>Doctor:</strong> {details.doctor || "N/A"}</div>
                      <div><strong>Status:</strong> Occupied</div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </section>

        <section
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            marginTop: 10,
          }}
        >
          <label htmlFor="roomSelect" style={{ fontWeight: "bold", fontSize: 16 }}>
            Select Available Room:
          </label>
          <select
            id="roomSelect"
            value={availableRoom}
            onChange={handleAvailableRoomChange}
            style={{
              padding: "8px",
              fontSize: 16,
              borderRadius: 6,
              border: "1.5px solid #28a745",
              backgroundColor: "#e9f7ef",
              maxWidth: 300,
              cursor: "pointer",
            }}
          >
            <option value="">-- Select a room --</option>
            {availableRooms.map((room) => (
              <option key={room} value={room}>
                {room}
              </option>
            ))}
          </select>

          <label htmlFor="roomInput" style={{ fontWeight: "bold", fontSize: 16 }}>
            Or enter room number:
          </label>
          <input
            id="roomInput"
            type="text"
            value={roomNumber}
            onChange={handleRoomInput}
            placeholder="Enter room number"
            style={{
              padding: "8px",
              fontSize: 16,
              borderRadius: 6,
              border: "1.5px solid #28a745",
              maxWidth: 300,
            }}
          />

          <button
            onClick={handleSearch}
            style={{
              marginTop: 12,
              padding: "12px 20px",
              fontSize: 16,
              fontWeight: "bold",
              backgroundColor: "#28a745",
              border: "none",
              borderRadius: 6,
              color: "#fff",
              cursor: "pointer",
              maxWidth: 150,
              transition: "background-color 0.3s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1e7e34")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#28a745")}
          >
            Search Room
          </button>
        </section>
      </main>

      {/* Tooltip for available rooms (NEW) */}
      {hoveredAvailableRoom && (
        <div
          style={{
            position: "fixed",
            top: availableTooltipPos.y,
            left: availableTooltipPos.x,
            backgroundColor: "rgba(0,0,0,0.85)",
            color: "white",
            padding: "8px 12px",
            borderRadius: 8,
            boxShadow: "0 2px 10px rgba(0,0,0,0.5)",
            pointerEvents: "none",
            whiteSpace: "nowrap",
            zIndex: 1000,
            maxWidth: 280,
          }}
        >
          {(() => {
            const details = getRoomDetails(hoveredAvailableRoom);
            if (!details) return <span>No details available</span>;

            return (
              <div style={{ fontSize: 14 }}>
                <div><strong>Room:</strong> {details.room_number}</div>
                <div><strong>Capacity:</strong> {details.capacity}</div>
                <div><strong>Type:</strong> {details.type}</div>
                <div><strong>Doctor:</strong> {details.doctor || "N/A"}</div>
                <div><strong>Status:</strong> Available</div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};


export default CheckRoomAvailabilityPage;
export { BookingConfirmationPage };
