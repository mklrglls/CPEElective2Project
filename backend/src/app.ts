const express = require('express');
const cors = require('cors');

const app = express();

// Allow all origins (for testing, not for production)
app.use(cors());

// Or allow specific origin
// app.use(cors({ origin: 'http://localhost:3000 }));

// Your routes
app.get('/api/rooms', (req, res) => {
  res.json([
    { id: 1, name: "Room 1" },
    { id: 2, name: "Room 2" }
  ]);
});

app.listen(4000, () => console.log('Server running on port 4000'));

