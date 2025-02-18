import { useRouter } from "next/router";
import useSWR from "swr";
import Link from "next/link";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function SearchPage() {
  const router = useRouter();
  // The query parameter is expected to be named "query"
  const { query: searchTerm } = router.query;
  const { data: tasks, error } = useSWR("/api/tasks", fetcher);

  if (error) return <div>Error loading tasks.</div>;
  if (!tasks) return <div>Loading tasks...</div>;

  // Filter tasks by title or description that include the search term (case-insensitive)
  const filteredTasks = tasks.filter((task) => {
    if (!searchTerm) return false;
    return (
      (task.title &&
        task.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (task.description &&
        task.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Search Results</h1>
      <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
        &larr; Back to Home
      </Link>
      {filteredTasks.length === 0 ? (
        <p>No tasks found matching "{searchTerm}".</p>
      ) : (
        <ul className="space-y-4">
          {filteredTasks.map((task) => (
            <li
              key={task.id || task._id}
              className="p-4 border rounded bg-gray-50"
            >
              <h3 className="text-xl font-semibold">{task.title}</h3>
              {task.description && <p>{task.description}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
