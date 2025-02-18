import useSWR, { mutate } from "swr";
import Link from "next/link";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Home() {
  const { data: tasks, error } = useSWR("/api/tasks", fetcher);

  if (error) return <div>Failed to load tasks</div>;
  if (!tasks) return <div>Loading...</div>;
  const now = new Date();
  const notifications = tasks.filter((task) => {
    if (!task.dueDate || task.done) return false;
    const dueDate = new Date(task.dueDate);
    const diff = dueDate - now;
    return diff > 0 && diff <= 86400000; // 24 hours in ms
  });

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      mutate("/api/tasks");
    } catch (error) {
      console.error(error);
    }
  };

  const toggleDone = async (task) => {
    try {
      await fetch(`/api/tasks/${task.id || task._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: task.title,
          description: task.description,
          done: !task.done,
          dueDate: task.dueDate || null,
        }),
      });
      mutate("/api/tasks");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-center space-x-4 mb-8">
        <Link
          href="/dashboard"
          className="px-6 py-3 bg-orange-600 text-white rounded hover:bg-gray-700"
        >
          Dashboard
        </Link>
        <Link
          href="/calendar"
          className="px-6 py-3 bg-orange-600 text-white rounded hover:bg-gray-700"
        >
          Calendar
        </Link>
      </div>

      <h2 className="text-3xl font-bold mb-6 text-orange-700">Your Tasks</h2>

      {/* Notification Section */}
      {notifications.length > 0 && (
        <div className="mb-6 p-4 bg-yellow-100 border-l-4 border-yellow-500">
          <h3 className="font-bold text-lg mb-2">Upcoming Due Dates</h3>
          <ul>
            {notifications.map((task) => (
              <li key={task.id || task._id} className="text-sm text-yellow-800">
                {task.title} is due on {new Date(task.dueDate).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Task List */}
      {tasks.length === 0 ? (
        <p className="text-gray-700">No tasks available.</p>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task.id || task._id}
              className="bg-gray-50 p-4 rounded border flex justify-between items-center"
            >
              <div>
                <h3
                  className={`text-lg font-semibold ${
                    task.done
                      ? "line-through text-gray-500"
                      : "text-orange-800"
                  }`}
                >
                  {task.title}
                </h3>
                {task.description && (
                  <p
                    className={`text-gray-700 ${
                      task.done ? "line-through text-gray-400" : ""
                    }`}
                  >
                    {task.description}
                  </p>
                )}
                {task.dueDate && (
                  <p className="text-sm text-gray-500">
                    Due: {new Date(task.dueDate).toLocaleDateString()}{" "}
                    {new Date(task.dueDate).toLocaleTimeString()}
                  </p>
                )}
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => toggleDone(task)}
                  className={`px-4 py-2 rounded text-white ${
                    task.done
                      ? "bg-gray-400 hover:bg-orange-500"
                      : "bg-gray-600 hover:bg-orange-700"
                  }`}
                >
                  {task.done ? "Undo" : "Done"}
                </button>
                <Link
                  href={`/edit/${task.id || task._id}`}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(task.id || task._id)}
                  className="bg-gray-600 hover:bg-orange-700 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 text-center">
        <Link
          href="/new"
          className="bg-orange-700 hover:bg-orange-700 text-white px-6 py-3 rounded"
        >
          + Create New Task
        </Link>
      </div>
    </div>
  );
}
