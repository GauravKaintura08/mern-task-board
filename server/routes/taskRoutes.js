import express from 'express';
import Task from '../models/Task.js';

const router = express.Router();

// Get tasks by board
router.get('/board/:boardId', async (req, res) => {
  const tasks = await Task.find({ boardId: req.params.boardId });
  res.json(tasks);
});

router.post('/', async (req, res) => {
  const task = await Task.create(req.body);
  res.json(task);
});

router.put('/:id', async (req, res) => {
  const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

router.delete('/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

export default router;
