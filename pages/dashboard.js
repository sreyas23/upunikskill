import useSWR from "swr";
import { useMemo } from "react";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Dashboard() {
  const { data: tasks, error } = useSWR("/api/tasks", fetcher);

  const stats = useMemo(() => {
    if (!tasks) return { total: 0, completed: 0, overdue: 0 };
    const total = tasks.length;
    const completed = tasks.filter((task) => task.done).length;
    const overdue = tasks.filter((task) => {
      if (!task.dueDate) return false;
      return new Date(task.dueDate) < new Date() && !task.done;
    }).length;
    return { total, completed, overdue };
  }, [tasks]);

  if (error) return <p>Error loading dashboard data.</p>;
  if (!tasks) return <p>Loading dashboard...</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 shadow rounded">
          <h2 className="text-xl font-semibold">Total Tasks</h2>
          <p className="text-2xl">{stats.total}</p>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <h2 className="text-xl font-semibold">Completed Tasks</h2>
          <p className="text-2xl">{stats.completed}</p>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <h2 className="text-xl font-semibold">Overdue Tasks</h2>
          <p className="text-2xl">{stats.overdue}</p>
        </div>
      </div>
    </div>
  );
}
