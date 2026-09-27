const express = require('express');
const router = express.Router();

let todos = [
  { id: 1, task: 'Contoh Tugas 1', completed: false }
];

// [GET] Ambil semua todo
router.get('/', (req, res) => {
  res.json({ success: true, data: todos });
});

// [POST] Tambah todo
router.post('/', (req, res) => {
  const { task } = req.body;
  if (!task) return res.status(400).json({ success: false, message: 'Task wajib diisi!' });

  const newTodo = {
    id: Date.now(),
    task,
    completed: false
  };
  todos.push(newTodo);

  res.status(201).json({ success: true, data: newTodo });
});

// [DELETE] Hapus todo
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  todos = todos.filter(t => t.id !== parseInt(id));
  res.json({ success: true, message: 'Todo berhasil dihapus' });
});

module.exports = router;
