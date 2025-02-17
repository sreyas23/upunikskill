// pages/edit/[id].js
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import useSWR from "swr";

const fetcher = url => fetch(url).then(res => res.json());

export default function EditTask() {
  const router = useRouter();
  const { id } = router.query;

  // Use SWR to fetch task data. It will return cached data (if any) immediately.
  const { data: task, error } = useSWR(id ? `/api/tasks/${id}` : null, fetcher, {
    refreshInterval: 0, // disable auto refresh if you don't want it
    revalidateOnFocus: false,
  });

  // Local state to hold form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [done, setDone] = useState(false);

  // When task data is fetched, populate the form fields
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setDone(task.done);
    }
  }, [task]);

  if (error) return <p>Error loading task.</p>;
  if (!task) return <p>Loading...</p>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) {
      alert("Task title is required.");
      return;
    }
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, done }),
      });
      if (res.ok) {
        router.push("/");
      } else {
        const data = await res.json();
        alert(data.message || "Failed to update the task");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("An error occurred while updating the task.");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Edit Task</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block font-medium mb-1">
            Title
          </label>
          <input
            id="title"
            className="w-full px-3 py-2 border rounded"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
          />
        </div>
        <div>
          <label htmlFor="description" className="block font-medium mb-1">
            Description
          </label>
          <textarea
            id="description"
            className="w-full px-3 py-2 border rounded"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Task description"
          />
        </div>
        <div className="flex items-center space-x-2">
          <input
            id="done"
            type="checkbox"
            checked={done}
            onChange={(e) => setDone(e.target.checked)}
          />
          <label htmlFor="done">Mark as Done</label>
        </div>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Update
        </button>
      </form>
    </div>
  );
}
