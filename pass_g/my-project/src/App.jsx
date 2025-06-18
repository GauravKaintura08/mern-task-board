import { useEffect, useState } from 'react';
import axios from 'axios';
import BoardView from './BoardView';
import TaskModal from './TaskModal';
import Sidebar from './SlideBar';
function App() {
  const [boards, setBoards] = useState([]);
  const [activeBoard, setActiveBoard] = useState(null);
  const [modalData, setModalData] = useState({ open: false });

  useEffect(() => {
    axios.get('http://localhost:5000/api/boards').then(r => setBoards(r.data));
  }, []);

  return (
    <div className="flex h-screen">
      {/* ✅ Use the styled Sidebar */}
      <Sidebar
        boards={boards}
        setBoards={setBoards}
        setActiveBoard={setActiveBoard}
      />

      {/* Board area */}
      <div className="flex-1 p-6 bg-gray-100 overflow-auto">
        {activeBoard ? (
          <BoardView
  board={activeBoard}
  openModal={modalData}
  setModal={setModalData}
  refreshKey={modalData.timestamp}
/>

        ) : (
          <div>Select a board to view tasks</div>
        )}
   {modalData.open && (
  <TaskModal
    {...modalData}
    setModal={setModalData}
    boardId={activeBoard._id}
    onTaskSaved={() => setModalData({ open: false, timestamp: Date.now() })}
  />
)}
      </div>
    </div>
  );
}

export default App;
