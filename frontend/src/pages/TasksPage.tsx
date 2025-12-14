import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { taskApi } from "../services/api";
import type { Task } from "../types/task";
import AddTaskButton from "../components/AddTaskButton";

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
        <div className="border-4 border-cyan w-100 h-96 bg-gray-50">
          <ul>
            {tasks.map((task) => (
              <li key={task.id}>
                {task.title} {task.is_done ? "✅" : "⬜"}
              </li>
            ))}
          </ul>
        </div>
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
