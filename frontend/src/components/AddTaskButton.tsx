import { useState } from "react";
import AddTaskModal from "./AddTaskModal";

interface AddTaskButtonProps {
  onTaskAdded: (title: string, dueDate: string) => void;
  disabled?: boolean;
}

function AddTaskButton({ onTaskAdded, disabled = false }: AddTaskButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="px-4 py-2 text-white font-medium bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg hover:from-teal-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-sm"
        onClick={() => setIsOpen(true)}
        disabled={disabled}
      >
        Add Task
      </button>
      {!disabled && (
        <AddTaskModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onTaskAdded={onTaskAdded}
        />
      )}
    </>
  );
}

export default AddTaskButton;
