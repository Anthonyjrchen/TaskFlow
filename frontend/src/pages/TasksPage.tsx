import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { taskApi } from "../services/api";
import type { Task } from "../types/task";
import AddTaskButton from "../components/AddTaskButton";
import TaskList from "../components/TaskList";

function TasksPage() {
  const { user, signOut } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);

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

  const handleTaskAdded = async (title: string) => {
    try {
      await taskApi.create({ title });
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

  if (user) {
    return (
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Task Manager</h1>
            <h2 className="text-gray-600">Welcome user {user.email}</h2>
          </div>
          <AddTaskButton onTaskAdded={handleTaskAdded} />
          <button
            type="button"
            className="border-2 bg-red-400 p-1 m-1"
            onClick={signOut}
          >
            Logout
          </button>
        </div>
        <TaskList tasks={tasks} onToggleTask={handleToggleTask} />
      </div>
    );
  } else {
    return (
      <div>
        <h1>Task Manager</h1>
        <h2>Not logged in.</h2>
      </div>
    );
  }
}

export default TasksPage;
