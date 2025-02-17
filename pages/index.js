// pages/index.js
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/tasks");
      if (!res.ok) throw new Error("Failed to fetch tasks");
      const data = await res.json();
      setTasks(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
      });
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const toggleDone = async (task) => {
    try {
      await fetch(`/api/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: task.title,
          description: task.description,
          done: !task.done,
        }),
      });
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, done: !t.done } : t))
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Your Tasks</h2>
      {tasks.length === 0 ? (
        <p className="text-gray-700">No tasks available.</p>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-gray-50 p-4 rounded border flex justify-between items-center"
            >
              <div>
                <h3
                  className={`text-lg font-semibold ${
                    task.done ? "line-through text-gray-500" : ""
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
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => toggleDone(task)}
                  className={`px-4 py-2 rounded text-white ${
                    task.done ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-500 hover:bg-green-600"
                  }`}
                >
                  {task.done ? "Undo" : "Done"}
                </button>
                <Link href={`/edit/${task.id}`}>
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                    Edit
                  </button>
                </Link>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-8">
        <Link href="/new">
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded">
            + Create New Task
          </button>
        </Link>
      </div>
    </div>
  );
}
