import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  DndContext,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const statuses = ['To Do', 'In Progress', 'Done'];

function SortableTask({ task, setModal, deleteTask }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="bg-white p-3 mb-2 rounded shadow"
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="font-medium">{task.title}</p>
          <span
            className={`text-xs px-1 rounded ${
              task.priority === 'High'
                ? 'bg-red-200 text-red-800'
                : task.priority === 'Medium'
                ? 'bg-yellow-200 text-yellow-800'
                : 'bg-green-200 text-green-800'
            }`}
          >
            {task.priority}
          </span>
        </div>
        <div className="space-x-1">
          <button
            className="text-blue-600 hover:underline text-sm"
            onClick={() => setModal({ open: true, mode: 'edit', task })}
          >
            Edit
          </button>
          <button
            className="text-red-600 hover:underline text-sm"
            onClick={() => deleteTask(task._id)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BoardView({ board, openModal, setModal, refreshTasks }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`http://localhost:5000/api/tasks/board/${board._id}`);
      setTasks(data);
    } catch (err) {
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [board]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks, refreshKey]);

  const updateTask = async (id, updates) => {
    await axios.put(`http://localhost:5000/api/tasks/${id}`, updates);
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:5000/api/tasks/${id}`);
    fetchTasks();
  };

  const sensors = useSensors(useSensor(PointerSensor));

  const onDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeTask = tasks.find((t) => t._id === active.id);
    const overTask = tasks.find((t) => t._id === over.id);

    if (activeTask.status !== overTask.status) {
      updateTask(active.id, { status: overTask.status });
    }
  };

  const grouped = statuses.reduce((acc, status) => {
    acc[status] = tasks.filter((t) => t.status === status);
    return acc;
  }, {});

  if (loading) return <p className="p-4">Loading tasks...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={onDragEnd}>
      <div className="grid grid-cols-3 gap-4">
        {statuses.map((status) => (
          <div key={status} className="p-2 bg-gray-100 rounded min-h-[400px]">
            <h3 className="font-semibold mb-2">{status}</h3>
            <SortableContext items={grouped[status].map((t) => t._id)} strategy={verticalListSortingStrategy}>
              {grouped[status].map((task) => (
                <SortableTask key={task._id} task={task} setModal={setModal} deleteTask={deleteTask} />
              ))}
            </SortableContext>
            <button
              className="mt-2 text-sm text-blue-600 hover:underline"
              onClick={() => setModal({ open: true, mode: 'create', defaultStatus: status })}
            >
              + Add task
            </button>
          </div>
        ))}
      </div>
    </DndContext>
  );
}

