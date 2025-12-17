const express = require('express');
const cors = require('cors');

const app = express();

// Enable CORS
app.use(cors());

// Parse incoming JSON payloads
app.use(express.json());

/* ----- ROUTES ----- */

// Health Check Route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'The Licktionary API is running' });
});

// Mount the Auth and Phrase routes here later

module.exports = app;