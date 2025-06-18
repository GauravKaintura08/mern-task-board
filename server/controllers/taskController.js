import Task from '../models/Task.js';

export const getTasksByBoard = async (req, res) => {
  const { boardId } = req.params;
  const tasks = await Task.find({ boardId }).sort('createdAt');
  res.json(tasks);
};

export const createTask = async (req, res) => {
  const { title, description, status, priority, assignedTo, dueDate } = req.body;
  const { boardId } = req.params;

  if (!title) return res.status(400).json({ error: 'Title is required' });

  const task = await Task.create({
    title,
    description,
    status,
    priority,
    assignedTo,
    dueDate,
    boardId,
  });

  res.status(201).json(task);
};

export const updateTask = async (req, res) => {
  const updates = req.body;
  const task = await Task.findByIdAndUpdate(req.params.id, updates, { new: true });

  if (!task) return res.status(404).json({ error: 'Task not found' });

  res.json(task);
};

export const deleteTask = async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};
