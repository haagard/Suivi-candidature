import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');

  // Fetch all todos on component mount
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get('/todos');
      setTodos(response.data);
    } catch (err) {
      console.error('Error fetching todos:', err);
    }
  };

  const addTodo = async () => {
    if (!title.trim()) return;
    
    try {
      await axios.post('/todos', {
        title: title.trim(),
        completed: false
      });
      setTitle('');
      fetchTodos();
    } catch (err) {
      console.error('Error adding todo:', err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`/todos/${id}`);
      fetchTodos();
    } catch (err) {
      console.error('Error deleting todo:', err);
    }
  };

  const toggleComplete = async (id, completed) => {
    try {
      await axios.put(`/todos/${id}`, {
        completed: !completed
      });
      fetchTodos();
    } catch (err) {
      console.error('Error updating todo:', err);
    }
  };

  const startEdit = (todo) => {
    setEditId(todo._id);
    setEditText(todo.title);
  };

  const saveEdit = async () => {
    try {
      await axios.put(`/todos/${editId}`, {
        title: editText
      });
      setEditId(null);
      fetchTodos();
    } catch (err) {
      console.error('Error updating todo:', err);
    }
  };

  return (
    <div className="app">
      <h1>Todo App</h1>
      
      <div className="todo-form">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter new todo"
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
        />
        <button onClick={addTodo}>Add</button>
      </div>

      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo._id} className={todo.completed ? 'completed' : ''}>
            {editId === todo._id ? (
              <>
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <button onClick={saveEdit}>Save</button>
              </>
            ) : (
              <>
                <span onClick={() => toggleComplete(todo._id, todo.completed)}>
                  {todo.title}
                </span>
                <div className="actions">
                  <button onClick={() => startEdit(todo)}>Edit</button>
                  <button onClick={() => deleteTodo(todo._id)}>Delete</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;