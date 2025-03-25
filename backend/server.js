const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const Todo = require('./models/Todo'); // Ensure this path is correct

// Initialize Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected!"))
  .catch(err => console.log("❌ MongoDB Error: ", err));

// Routes
app.post('/todos', async (req, res) => {
  try {
    const newTodo = await Todo.create(req.body);
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Add other CRUD routes here (GET, PUT, DELETE)...

// Start Server
app.listen(PORT, () => {
  console.log(`🔥 Server running on http://localhost:${PORT}`);
});
// Get all todos
app.get('/todos', async (req, res) => {
    try {
      const todos = await Todo.find();
      res.json(todos);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  // Get a single todo by ID
  app.get('/todos/:id', async (req, res) => {
    try {
      const todo = await Todo.findById(req.params.id);
      if (!todo) return res.status(404).json({ error: 'Todo not found' });
      res.json(todo);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  // Update a todo by ID
  app.put('/todos/:id', async (req, res) => {
    try {
      const updatedTodo = await Todo.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true } // Returns the updated document
      );
      if (!updatedTodo) return res.status(404).json({ error: 'Todo not found' });
      res.json(updatedTodo);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  
  // Delete a todo by ID
  app.delete('/todos/:id', async (req, res) => {
    try {
      const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
      if (!deletedTodo) return res.status(404).json({ error: 'Todo not found' });
      res.json({ message: 'Todo deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });