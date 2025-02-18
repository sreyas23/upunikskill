import { useRouter } from "next/router";
import useSWR, { mutate } from "swr";
import { useEffect, useState } from "react";
import Link from "next/link";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function EditTask() {
  const router = useRouter();
  const { id } = router.query;
  if (!router.isReady) return <div>Loading...</div>;

  const { data: task, error } = useSWR(id ? `/api/tasks/${id}` : null, fetcher);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setDueDate(task.dueDate ? task.dueDate.split(".")[0] : "");
      setDone(task.done);
    }
  }, [task]);

  if (error) return <div>Error loading task.</div>;
  if (!task) return <div>Loading...</div>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, dueDate, done }),
      });
      if (!res.ok) throw new Error("Failed to update task");
      mutate("/api/tasks");
      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <Link href="/" className="mb-4 inline-block text-blue-600 hover:underline">
        Home
      </Link>
      <h2 className="text-2xl font-bold mb-4">Edit Task</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block mb-1 font-medium">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="description" className="block mb-1 font-medium">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded px-3 py-2"
            rows="3"
          ></textarea>
        </div>
        <div>
          <label htmlFor="dueDate" className="block mb-1 font-medium">
            Due Date
          </label>
          <input
            id="dueDate"
            type="datetime-local"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div className="flex items-center">
          <input
            id="done"
            type="checkbox"
            checked={done}
            onChange={(e) => setDone(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="done" className="font-medium">
            Mark as done
          </label>
        </div>
        <button
          type="submit"
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded"
        >
          Update Task
        </button>
      </form>
    </div>
  );
}
