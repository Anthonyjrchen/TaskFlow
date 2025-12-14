import { Fragment, useState, useEffect } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import type { Task } from "../types/task";

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onSave: (taskId: number, newTitle: string) => Promise<void>;
}

function EditTaskModal({ isOpen, onClose, task, onSave }: EditTaskModalProps) {
  const [title, setTitle] = useState(task?.title || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!task || !title.trim()) return;

    setIsSaving(true);
    try {
      await onSave(task.id, title.trim());
      onClose();
    } catch (error) {
      console.error("Error saving task:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Reset title when modal opens with a new task or when modal closes
  useEffect(() => {
    if (isOpen && task) {
      setTitle("");
    } else if (!isOpen) {
      setTitle("");
    }
  }, [isOpen, task]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-2xl transition-all">
                <DialogTitle
                  as="h3"
                  className="text-xl font-semibold leading-6 text-gray-900 mb-4"
                >
                  Edit Task
                </DialogTitle>

                <div className="mt-4">
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
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSave();
                      }
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all outline-none"
                    placeholder="Enter task title..."
                    autoFocus
                  />
                </div>

                <div className="mt-6 flex gap-3 justify-end">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 transition-all"
                    onClick={onClose}
                    disabled={isSaving}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 text-sm font-medium text-white hover:from-cyan-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                    onClick={handleSave}
                    disabled={isSaving || !title.trim()}
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default EditTaskModal;
