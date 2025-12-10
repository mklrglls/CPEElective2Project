const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const connection = require('./db'); // Your DB connection

const app = express();
const PORT = 4000;

// Secret for JWT (use environment variable in production)
const JWT_SECRET = 'your_super_secret_key';

// CORS setup
app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'PUT', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.use(express.json());

// ----------------------
// AUTH MIDDLEWARE
// ----------------------
function authenticateToken(req, res, next) {
  next();
  // const authHeader = req.headers['authorization'];
  // const token = authHeader && authHeader.split(' ')[1];

  // if (!token) {
  //   return res.status(401).json({ error: 'Token missing' });
  // }

  // jwt.verify(token, JWT_SECRET, (err, user) => {
  //   if (err) {
  //     return res.status(403).json({ error: 'Invalid or expired token' });
  //   }
  //   req.user = user;
  //   next();
  // });
}

// ----------------------
// LOGIN ROUTE
// ----------------------
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  const mockUser = {
    id: 1,
    username: 'admin',
    password: 'password123',
  };

  if (username !== mockUser.username || password !== mockUser.password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { userId: mockUser.id, username: mockUser.username },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({ token });
});

// ----------------------
// GET ALL ROOMS
// ----------------------
app.get('/rooms/all', authenticateToken, (req, res) => {
  connection.query('SELECT * FROM rooms', (err, results) => {
    if (err) {
      console.error('Error fetching rooms:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// ----------------------
// GET SINGLE ROOM
// ----------------------
app.get('/rooms/:roomNumber', authenticateToken, (req, res) => {
  const roomNumber = req.params.roomNumber;

  connection.query(
    'SELECT * FROM rooms WHERE room_number = ? LIMIT 1',
    [roomNumber],
    (err, results) => {
      if (err) {
        console.error('Error fetching room:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: 'Room not found' });
      }

      // Parse doctors JSON if stored as string
      let room = results[0];
      if (typeof room.doctors === 'string') {
        try {
          room.doctors = JSON.parse(room.doctors);
        } catch {
          room.doctors = [];
        }
      }

      res.json(room);
    }
  );
});

// ----------------------
// PUT UPDATE ROOM DETAILS
// ----------------------
app.put('/rooms/:roomNumber', (req, res) => {
  console.log('Received PUT /rooms/:roomNumber with body:', req.body);
  const roomNumber = req.params.roomNumber;
  const { capacity, type, doctors } = req.body;

  if (
    capacity === undefined ||
    type === undefined ||
    doctors === undefined ||
    !Array.isArray(doctors)
  ) {
    return res.status(400).json({ error: 'Missing or invalid room details in request body' });
  }

  const doctorsJson = JSON.stringify(doctors);
 let json = doctorsJson.replace(/'/g, '"'); 
let doctorsArray = JSON.parse(json);
let doctorname = doctorsArray[0];
console.log(doctorname)
  const query = 'UPDATE rooms SET capacity = ?, type = ?, doctor = ? WHERE room_number = ?';
  connection.query(query, [capacity, type, doctorname, roomNumber], (err, results) => {
    if (err) {
      console.error('Error updating room:', err);
      return res.status(500).json({ error: 'Database error updating room' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Room not found' });
    }

    res.json({ message: 'Room updated successfully' });
  });
});

// ----------------------
// POST MARK ROOM AS OCCUPIED
// ----------------------
app.post('/rooms/:roomNumber/make-occupied', authenticateToken, (req, res) => {
  const roomNumber = req.params.roomNumber;

  const query = 'UPDATE rooms SET available = 0 WHERE room_number = ?';
  connection.query(query, [roomNumber], (err, results) => {
    if (err) {
      console.error('Error marking room as occupied:', err);
      return res.status(500).json({ error: 'Database error marking room as occupied' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Room not found' });
    }

    res.json({ message: 'Room marked as occupied' });
  });
});

app.get('/rooms/:roomNumber/make-available', authenticateToken, (req, res) => {
  const roomNumber = req.params.roomNumber;
  console.log('Making room available:', roomNumber);
  const query = 'UPDATE rooms SET available = 1 WHERE room_number = ?';
  connection.query(query, [roomNumber], (err, results) => {
    if (err) {
      console.error('Error marking room as occupied:', err);
      return res.status(500).json({ error: 'Database error marking room as occupied' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Room not found' });
    }

    res.json({ message: 'Room marked as occupied' });
  });
});
// ----------------------
// START SERVER
// ----------------------
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
