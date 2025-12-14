import { useState } from "react";
import AddTaskModal from "./AddTaskModal";

interface AddTaskButtonProps {
  onTaskAdded: (title: string, dueDate: string) => void;
}

function AddTaskButton({ onTaskAdded }: AddTaskButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="border-2 bg-green-400 p-1 m-1"
        onClick={() => setIsOpen(true)}
      >
        Add Task
      </button>
      <AddTaskModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onTaskAdded={onTaskAdded}
      />
    </>
  );
}

export default AddTaskButton;
