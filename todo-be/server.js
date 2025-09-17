require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());

// ✅ MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// GET all todos
app.get('/api/todos', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM todos ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    console.error("GET /todos error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// GET single todo
app.get('/api/todos/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM todos WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Todo not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error("GET /todos/:id error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// CREATE todo
app.post('/api/todos', async (req, res) => {
  try {
    const { title } = req.body;
    if (!title || !title.trim()) return res.status(400).json({ error: 'Title is required' });

    const [result] = await pool.query(
      'INSERT INTO todos (title, completed) VALUES (?, ?)',
      [title.trim(), false]
    );

    res.status(201).json({ id: result.insertId, title: title.trim(), completed: false });
  } catch (err) {
    console.error("POST /todos error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// UPDATE todo
app.put('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, completed } = req.body;

    const [rows] = await pool.query('SELECT * FROM todos WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Todo not found' });

    const updatedTitle = title ?? rows[0].title;
    const updatedCompleted = typeof completed === 'boolean' ? completed : rows[0].completed;

    await pool.query('UPDATE todos SET title = ?, completed = ? WHERE id = ?', [
      updatedTitle, updatedCompleted, id
    ]);

    res.json({ id, title: updatedTitle, completed: updatedCompleted });
  } catch (err) {
    console.error("PUT /todos/:id error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// DELETE todo
app.delete('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM todos WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Todo not found' });
    res.status(204).send();
  } catch (err) {
    console.error("DELETE /todos/:id error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// Simple health
app.get('/', (req, res) => res.send('Todo API running with MySQL ✅'));

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
