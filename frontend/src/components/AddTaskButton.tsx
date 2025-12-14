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
        className="px-4 py-2 text-white font-medium bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg hover:from-green-600 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-sm"
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
