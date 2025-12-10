const mysql = require('mysql2'); // Changed from mysql to mysql2
const bcrypt = require('bcrypt');

// MySQL connection setup — update with your credentials
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456789',
  database: 'hospital_db',
});

connection.connect((err) => {
  if (err) {
    console.error('MySQL connection error:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL');
});

const username = 'admin';
const plainPassword = 'password123';

const saltRounds = 10;

bcrypt.hash(plainPassword, saltRounds, (err, hashedPassword) => {
  if (err) {
    console.error('Error hashing password:', err);
    process.exit(1);
  }

  const query = 'INSERT INTO users (username, password_hash) VALUES (?, ?)';
  connection.query(query, [username, hashedPassword], (err, results) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        console.log('User already exists');
      } else {
        console.error('Error inserting user:', err);
      }
    } else {
      console.log('User inserted with ID:', results.insertId);
    }
    connection.end();
  });
});
