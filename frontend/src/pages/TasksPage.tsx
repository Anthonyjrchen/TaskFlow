import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { taskApi } from "../services/api";
import type { Task } from "../types/task";
import AddTaskButton from "../components/AddTaskButton";
import TaskList from "../components/TaskList";
import EditTaskModal from "../components/EditTaskModal";

function TasksPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  useEffect(() => {
    if (user) {
      loadTasks();
    }
  }, [user?.id]);

  const loadTasks = async () => {
    try {
      const data = await taskApi.getAll();
      setTasks(data);
      console.log("Tasks loaded:", data);
    } catch (err: any) {
      console.error("Error loading tasks:", err);
    }
  };

  const handleTaskAdded = async (title: string, dueDate: string) => {
    try {
      await taskApi.create({ title, due_date: dueDate });
      loadTasks();
    } catch (err: any) {
      console.error("Error creating task:", err);
    }
  };

  const handleToggleTask = async (taskId: number) => {
    try {
      const task = tasks.find((t) => t.id === taskId);
      if (task) {
        await taskApi.update(taskId, { isDone: !task.is_done });
        loadTasks();
      }
    } catch (err: any) {
      console.error("Error toggling task:", err);
    }
  };

  const handleEditTask = (taskId: number) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      setTaskToEdit(task);
      setIsEditModalOpen(true);
    }
  };

  const handleSaveEdit = async (taskId: number, newTitle: string) => {
    await taskApi.update(taskId, { title: newTitle });
    loadTasks();
    setIsEditModalOpen(false);
    setTaskToEdit(null);
  };

  const handleDeleteTask = async (taskId: number) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await taskApi.delete(taskId);
        loadTasks();
      } catch (err: any) {
        console.error("Error deleting task:", err);
      }
    }
  };

  return (
    <div className="h-screen flex flex-col p-6 overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Task Manager</h1>
          <h2 className="text-gray-600">
            {user
              ? `Welcome user ${user.email}`
              : "Please log in to manage your tasks"}
          </h2>
        </div>
        <AddTaskButton onTaskAdded={handleTaskAdded} disabled={!user} />
        {user ? (
          <button
            type="button"
            className="px-4 py-2 text-white font-medium bg-gradient-to-r from-red-500 to-pink-500 rounded-lg hover:from-red-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all shadow-sm hover:shadow-md"
            onClick={signOut}
          >
            Logout
          </button>
        ) : (
          <button
            type="button"
            className="px-4 py-2 text-white font-medium bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg hover:from-cyan-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 transition-all shadow-sm hover:shadow-md"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto">
        {user ? (
          <>
            <TaskList
              tasks={tasks}
              onToggleTask={handleToggleTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
            />
            <EditTaskModal
              isOpen={isEditModalOpen}
              onClose={() => setIsEditModalOpen(false)}
              task={taskToEdit}
              onSave={handleSaveEdit}
            />
          </>
        ) : (
          <div className="w-full overflow-hidden rounded-xl shadow-lg bg-white">
            <div className="px-6 py-12 text-center text-gray-500">
              Log in to view your tasks
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TasksPage;
