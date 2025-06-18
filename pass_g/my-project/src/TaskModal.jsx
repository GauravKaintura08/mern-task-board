// import { Fragment, useState, useEffect } from 'react';
// import { Dialog, Transition } from '@headlessui/react';
// import axios from 'axios';

// function TaskModal({ open, mode, task = {}, defaultStatus = 'To Do', boardId, setModal, onTaskSaved }) {
//   const [form, setForm] = useState({
//     title: '',
//     description: '',
//     status: defaultStatus,
//     priority: 'Low',
//     assignedTo: '',
//     dueDate: ''
//   });

//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (mode === 'edit' && task?._id) {
//       setForm({
//         title: task.title || '',
//         description: task.description || '',
//         status: task.status || defaultStatus,
//         priority: task.priority || 'Low',
//         assignedTo: task.assignedTo || '',
//         dueDate: task.dueDate ? task.dueDate.slice(0, 10) : ''
//       });
//     } else if (mode === 'create') {
//       setForm({
//         title: '',
//         description: '',
//         status: defaultStatus,
//         priority: 'Low',
//         assignedTo: '',
//         dueDate: ''
//       });
//     }
//   }, [mode, task?._id, defaultStatus]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!form.title.trim()) return alert('Title is required');

//     setLoading(true);
//     try {
//       if (mode === 'create') {
//         // ✅ Fixed: Changed to valid route
//         await axios.post('http://localhost:5000/api/tasks', {
//           ...form,
//           board: boardId,
//         });
//       } else {
//         await axios.put(`http://localhost:5000/api/tasks/${task._id}`, form);
//       }
//       onTaskSaved?.();
//     } catch (err) {
//       console.error(err);
//       alert('Failed to save task');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async () => {
//     const confirmDelete = window.confirm('Are you sure you want to delete this task?');
//     if (!confirmDelete) return;

//     setLoading(true);
//     try {
//       await axios.delete(`http://localhost:5000/api/tasks/${task._id}`);
//       onTaskSaved?.();
//     } catch {
//       alert('Failed to delete task');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Transition appear show={open} as={Fragment}>
//       <Dialog as="div" className="relative z-10" onClose={() => setModal({ open: false })}>
//         <Transition.Child
//           as={Fragment}
//           enter="ease-out duration-200"
//           enterFrom="opacity-0"
//           enterTo="opacity-40"
//           leave="ease-in duration-150"
//           leaveFrom="opacity-40"
//           leaveTo="opacity-0"
//         >
//           <div className="fixed inset-0 bg-black" />
//         </Transition.Child>

//         <div className="fixed inset-0 overflow-y-auto">
//           <div className="flex items-center justify-center min-h-full p-4">
//             <Transition.Child
//               as={Fragment}
//               enter="ease-out duration-200 transform"
//               enterFrom="scale-95 opacity-0"
//               enterTo="scale-100 opacity-100"
//               leave="ease-in duration-150 transform"
//               leaveFrom="scale-100 opacity-100"
//               leaveTo="scale-95 opacity-0"
//             >
//               <Dialog.Panel className="bg-white rounded max-w-md w-full p-6">
//                 <Dialog.Title className="text-lg font-medium mb-4">
//                   {mode === 'create' ? 'New Task' : 'Edit Task'}
//                 </Dialog.Title>

//                 <form onSubmit={handleSubmit} className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium">Title *</label>
//                     <input
//                       required
//                       className="mt-1 w-full border rounded px-2 py-1"
//                       value={form.title}
//                       onChange={e => setForm({ ...form, title: e.target.value })}
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium">Description</label>
//                     <textarea
//                       className="mt-1 w-full border rounded px-2 py-1"
//                       value={form.description}
//                       onChange={e => setForm({ ...form, description: e.target.value })}
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium">Status</label>
//                     <select
//                       className="mt-1 w-full border rounded px-2 py-1"
//                       value={form.status}
//                       onChange={e => setForm({ ...form, status: e.target.value })}
//                     >
//                       {['To Do', 'In Progress', 'Done'].map((s) => (
//                         <option key={s} value={s}>{s}</option>
//                       ))}
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium">Priority</label>
//                     <select
//                       className="mt-1 w-full border rounded px-2 py-1"
//                       value={form.priority}
//                       onChange={e => setForm({ ...form, priority: e.target.value })}
//                     >
//                       <option value="Low">Low</option>
//                       <option value="Medium">Medium</option>
//                       <option value="High">High</option>
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium">Assigned To</label>
//                     <input
//                       className="mt-1 w-full border rounded px-2 py-1"
//                       value={form.assignedTo}
//                       onChange={e => setForm({ ...form, assignedTo: e.target.value })}
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium">Due Date</label>
//                     <input
//                       type="date"
//                       className="mt-1 w-full border rounded px-2 py-1"
//                       value={form.dueDate}
//                       onChange={e => setForm({ ...form, dueDate: e.target.value })}
//                     />
//                   </div>

//                   <div className="flex justify-between items-center mt-6">
//                     <div className="space-x-2">
//                       <button
//                         type="button"
//                         className="px-4 py-2 bg-gray-200 rounded"
//                         onClick={() => setModal({ open: false })}
//                       >
//                         Cancel
//                       </button>
//                       <button
//                         type="submit"
//                         disabled={loading}
//                         className={`px-4 py-2 text-white rounded ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
//                       >
//                         {loading ? 'Saving...' : 'Save'}
//                       </button>
//                     </div>

//                     {mode === 'edit' && (
//                       <button
//                         type="button"
//                         onClick={handleDelete}
//                         disabled={loading}
//                         className="text-sm text-red-600 hover:text-red-800"
//                       >
//                         🗑️ Delete
//                       </button>
//                     )}
//                   </div>
//                 </form>
//               </Dialog.Panel>
//             </Transition.Child>
//           </div>
//         </div>
//       </Dialog>
//     </Transition>
//   );
// }

// export default TaskModal;

import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import axios from 'axios';

function TaskModal({ open, mode, task = {}, defaultStatus = 'To Do', boardId, setModal, onTaskSaved }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: defaultStatus,
    priority: 'Low',
    assignedTo: '',
    dueDate: ''
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && task?._id) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        status: task.status || defaultStatus,
        priority: task.priority || 'Low',
        assignedTo: task.assignedTo || '',
        dueDate: task.dueDate ? task.dueDate.slice(0, 10) : ''
      });
    } else {
      setForm({
        title: '',
        description: '',
        status: defaultStatus,
        priority: 'Low',
        assignedTo: '',
        dueDate: ''
      });
    }
  }, [mode, task?._id, defaultStatus]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return alert('Title is required');

    setLoading(true);
    try {
      if (mode === 'create') {
        await axios.post('http://localhost:5000/api/tasks', {
          ...form,
          board: boardId,
        });
      } else {
        await axios.put(`http://localhost:5000/api/tasks/${task._id}`, form);
      }
      onTaskSaved?.();
      setModal({ open: false }); // ✅ Close modal after save
    } catch (err) {
      console.error(err);
      alert('Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this task?');
    if (!confirmDelete) return;

    setLoading(true);
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${task._id}`);
      onTaskSaved?.();
      setModal({ open: false }); // ✅ Close modal after delete
    } catch {
      alert('Failed to delete task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => setModal({ open: false })}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-40"
          leave="ease-in duration-150"
          leaveFrom="opacity-40"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-full p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200 transform"
              enterFrom="scale-95 opacity-0"
              enterTo="scale-100 opacity-100"
              leave="ease-in duration-150 transform"
              leaveFrom="scale-100 opacity-100"
              leaveTo="scale-95 opacity-0"
            >
              <Dialog.Panel className="bg-white rounded max-w-md w-full p-6">
                <Dialog.Title className="text-lg font-medium mb-4">
                  {mode === 'create' ? 'New Task' : 'Edit Task'}
                </Dialog.Title>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium">Title *</label>
                    <input
                      required
                      className="mt-1 w-full border rounded px-2 py-1"
                      value={form.title}
                      onChange={e => setForm({ ...form, title: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Description</label>
                    <textarea
                      className="mt-1 w-full border rounded px-2 py-1"
                      value={form.description}
                      onChange={e => setForm({ ...form, description: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Status</label>
                    <select
                      className="mt-1 w-full border rounded px-2 py-1"
                      value={form.status}
                      onChange={e => setForm({ ...form, status: e.target.value })}
                    >
                      {['To Do', 'In Progress', 'Done'].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Priority</label>
                    <select
                      className="mt-1 w-full border rounded px-2 py-1"
                      value={form.priority}
                      onChange={e => setForm({ ...form, priority: e.target.value })}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Assigned To</label>
                    <input
                      className="mt-1 w-full border rounded px-2 py-1"
                      value={form.assignedTo}
                      onChange={e => setForm({ ...form, assignedTo: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Due Date</label>
                    <input
                      type="date"
                      className="mt-1 w-full border rounded px-2 py-1"
                      value={form.dueDate}
                      onChange={e => setForm({ ...form, dueDate: e.target.value })}
                    />
                  </div>

                  <div className="flex justify-between items-center mt-6">
                    <div className="space-x-2">
                      <button
                        type="button"
                        className="px-4 py-2 bg-gray-200 rounded"
                        onClick={() => setModal({ open: false })}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className={`px-4 py-2 text-white rounded ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                      >
                        {loading ? 'Saving...' : 'Save'}
                      </button>
                    </div>

                    {mode === 'edit' && (
                      <button
                        type="button"
                        onClick={handleDelete}
                        disabled={loading}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        🗑️ Delete
                      </button>
                    )}
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default TaskModal;
