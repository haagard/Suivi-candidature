require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Suivi = require('./models/Suivi');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/suivis', async (req, res) => {
  try {
    const suivis = await Suivi.find().sort({ dateEnvoi: -1 }); // Newest first
    res.json(suivis);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add other CRUD routes...

// Modern MongoDB Connection (v4.0.0+)
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected!");
  } catch (err) {
    console.log("❌ MongoDB Connection Error: ", err.message);
    // Graceful shutdown
    process.exit(1); 
  }
};

// Connection events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to DB cluster');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

// Start server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🔥 Server running on http://localhost:${PORT}`);
  });
};

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0);
});

startServer();