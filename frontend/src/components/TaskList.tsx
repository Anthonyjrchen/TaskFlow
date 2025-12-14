import type { Task } from "../types/task";

interface TaskListProps {
  tasks: Task[];
  onToggleTask?: (taskId: number) => void;
  onEditTask?: (taskId: number) => void;
  onDeleteTask?: (taskId: number) => void;
}

function TaskList({
  tasks,
  onToggleTask,
  onEditTask,
  onDeleteTask,
}: TaskListProps) {
  // Sort tasks by due_date (ascending), then by title (alphabetically)
  const sortedTasks = [...tasks].sort((a, b) => {
    // Compare due dates
    const dateComparison = a.due_date.localeCompare(b.due_date);
    if (dateComparison !== 0) return dateComparison;

    // If dates are equal, compare titles alphabetically
    return a.title.localeCompare(b.title);
  });

  return (
    <div className="w-full overflow-hidden rounded-xl shadow-lg bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-cyan-500 to-blue-500">
            <tr>
              <th className="px-6 py-4 text-center text-sm font-semibold text-white uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                Task Name
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-white uppercase tracking-wider">
                Due Date
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-white uppercase tracking-wider">
                Edit
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-white uppercase tracking-wider">
                Delete
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedTasks.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No tasks yet. Add one to get started!
                </td>
              </tr>
            ) : (
              sortedTasks.map((task) => (
                <tr
                  key={task.id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <input
                      type="checkbox"
                      checked={task.is_done}
                      onChange={() => onToggleTask?.(task.id)}
                      className="h-5 w-5 rounded border-gray-300 text-cyan-600 focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 cursor-pointer transition-all"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`text-sm font-medium ${
                        task.is_done
                          ? "text-gray-400 line-through"
                          : "text-gray-900"
                      }`}
                    >
                      {task.title}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-sm text-gray-700">
                      {new Date(task.due_date + "T00:00:00").toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => onEditTask?.(task.id)}
                      className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-150 shadow-sm hover:shadow-md"
                    >
                      Edit
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => onDeleteTask?.(task.id)}
                      className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-150 shadow-sm hover:shadow-md"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TaskList;
