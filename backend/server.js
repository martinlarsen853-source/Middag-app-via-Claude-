require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json());

// Initialize DB and seed
const db = require('./db');
const seed = require('./seed');
seed();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/meals', require('./routes/meals'));
app.use('/api/shopping', require('./routes/shopping'));
app.use('/api/household', require('./routes/household'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Middagshjulet API er oppe!' });
});

app.listen(PORT, () => {
  console.log(`Middagshjulet server kjorer pa port ${PORT}`);
});
