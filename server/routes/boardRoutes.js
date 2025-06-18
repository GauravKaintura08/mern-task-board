import express from 'express';
import Board from '../models/Board.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const boards = await Board.find().sort({ createdAt: -1 });
  res.json(boards);
});

router.post('/', async (req, res) => {
  const board = await Board.create({ name: req.body.name });
  res.json(board);
});

export default router;
