import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { taskApi } from "../services/api";
import type { Task } from "../types/task";

function TasksPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (!user) return;

    const loadTasks = async () => {
      try {
        const data = await taskApi.getAll();
        setTasks(data);
        console.log("Tasks loaded:", data);
      } catch (err: any) {
        console.error("Error loading tasks:", err);
      }
    };

    loadTasks();
  }, [user?.id]);

  if (user) {
    return (
      <div>
        <h1>Task Manager</h1>
        <h2>Welcome user {user.email}</h2>
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
