const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to your TiDB database
const connection = mysql.createConnection(process.env.DATABASE_URL);

connection.connect((err) => {
  if (err) {
    console.log("Database error:", err);
  } else {
    console.log("Connected to Database!");
    
    // Create a place to store messages
    const createTable = `
      CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255),
        message TEXT
      )
    `;
    connection.query(createTable);
  }
});

// The link your website will use to send data
app.post('/contact', (req, res) => {
  const { name, email, message } = req.body;
  const insertQuery = "INSERT INTO messages (name, email, message) VALUES (?, ?, ?)";
  
  connection.query(insertQuery, [name, email, message], (err) => {
    if (err) {
      res.status(500).send("Error");
    } else {
      res.status(200).send("Success");
    }
  });
});

// Turn the server on
app.listen(3000, () => {
  console.log("Server is running!");
});