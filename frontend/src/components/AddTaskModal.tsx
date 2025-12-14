import { useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskAdded: (title: string, dueDate: string) => void;
}

function AddTaskModal({ isOpen, onClose, onTaskAdded }: AddTaskModalProps) {
  const [title, setTitle] = useState("");

  // Get today's date in local timezone (PST)
  const getTodayLocal = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [dueDate, setDueDate] = useState(getTodayLocal());

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onTaskAdded(title, dueDate);
    setTitle("");
    setDueDate(getTodayLocal());
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* Full-screen container to center the panel */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        {/* Modal panel */}
        <DialogPanel className="mx-auto max-w-sm rounded-lg bg-white p-6 shadow-xl">
          <DialogTitle className="text-lg font-medium mb-4">
            Add New Task
          </DialogTitle>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="task-title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Task Title
              </label>
              <input
                id="task-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task title"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label
                htmlFor="due-date"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                getTodayLocal() Due Date
              </label>
              <input
                id="due-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-white bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg hover:from-cyan-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all shadow-sm hover:shadow-md"
              >
                Add Task
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

export default AddTaskModal;
