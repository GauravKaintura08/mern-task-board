import Board from '../models/Board.js';

export const getBoards = async (req, res) => {
  const boards = await Board.find().sort('-createdAt');
  res.json(boards);
};

export const createBoard = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });

  const board = await Board.create({ name });
  res.status(201).json(board);
};
