import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Sidebar({ boards, setBoards, setActiveBoard }) {
  const [showInput, setShowInput] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');

  const handleAddBoard = async () => {
    if (!newBoardName.trim()) return;
    try {
      const res = await axios.post('http://localhost:5000/api/boards', { name: newBoardName });
      setNewBoardName('');
      setShowInput(false);
      setBoards(prev => [...prev, res.data]);
    } catch (err) {
      alert('Failed to create board');
    }
  };

  return (
    <div className="w-64 bg-gradient-to-br from-blue-700 to-purple-800 text-white p-6 shadow-xl">
      <h2 className="text-3xl font-bold mb-8 tracking-wide">📋 My Boards</h2>

      <ul className="space-y-4">
        {boards.map(b => (
          <li
            key={b._id}
            className="cursor-pointer bg-white/10 hover:bg-white/20 p-3 rounded-md text-lg font-medium transition-all duration-200"
            onClick={() => setActiveBoard(b)}
          >
            📌 {b.name}
          </li>
        ))}
      </ul>

      {showInput ? (
        <div className="mt-6">
          <input
            type="text"
            value={newBoardName}
            onChange={(e) => setNewBoardName(e.target.value)}
            placeholder="New board name"
            className="w-full px-4 py-2 rounded-md bg-white text-black placeholder-gray-400"
          />
          <button
            onClick={handleAddBoard}
            className="mt-3 w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-md font-semibold"
          >
            ✅ Create Board
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowInput(true)}
          className="mt-8 w-full bg-white/20 hover:bg-white/30 py-3 text-base rounded-md font-medium transition"
        >
          ➕ Add New Board
        </button>
      )}
    </div>
  );
}
