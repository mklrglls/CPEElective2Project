const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456789',
  database: 'hospital_db'
});

connection.connect(err => {
  if (err) {
    console.error('MySQL connection error:', err);
  } else {
    console.log('MySQL connected successfully!');
  }
});

module.exports = connection;
