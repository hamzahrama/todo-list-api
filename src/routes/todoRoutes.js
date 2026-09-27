const express = require('express');
const Database = require('better-sqlite3');

const router = express.Router();
const db = new Database('todo.db');

// Buat tabel otomatis jika belum ada
db.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task TEXT NOT NULL,
    completed INTEGER DEFAULT 0
  )
`);

// [GET] Ambil semua todo
router.get('/', (req, res) => {
  const todos = db.prepare('SELECT * FROM todos').all();
  res.json({ success: true, data: todos });
});

// [POST] Tambah todo baru
router.post('/', (req, res) => {
  const { task } = req.body;
  if (!task) return res.status(400).json({ success: false, message: 'Task wajib diisi!' });

  const stmt = db.prepare('INSERT INTO todos (task) VALUES (?)');
  const info = stmt.run(task);

  res.status(201).json({
    success: true,
    data: { id: info.lastInsertRowid, task, completed: 0 }
  });
});

// [PUT] Update status/task todo
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { task, completed } = req.body;

  if (task !== undefined) {
    db.prepare('UPDATE todos SET task = ? WHERE id = ?').run(task, id);
  }
  if (completed !== undefined) {
    db.prepare('UPDATE todos SET completed = ? WHERE id = ?').run(completed ? 1 : 0, id);
  }

  res.json({ success: true, message: 'Todo berhasil diperbarui' });
});

// [DELETE] Hapus todo
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.prepare('DELETE FROM todos WHERE id = ?').run(id);
  res.json({ success: true, message: `Todo dengan ID ${id} berhasil dihapus` });
});

module.exports = router;
