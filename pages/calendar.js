import { useState, useEffect } from "react";
import useSWR from "swr";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function CalendarView() {
  const { data: tasks, error } = useSWR("/api/tasks", fetcher);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasksForDate, setTasksForDate] = useState([]);

  useEffect(() => {
    if (tasks) {
      const filtered = tasks.filter((task) => {
        if (!task.dueDate) return false;
        const dueDate = new Date(task.dueDate);
        return dueDate.toDateString() === selectedDate.toDateString();
      });
      setTasksForDate(filtered);
    }
  }, [tasks, selectedDate]);

  if (error) return <p>Error loading calendar.</p>;
  if (!tasks) return <p>Loading calendar...</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Task Calendar</h1>
      <Calendar onChange={setSelectedDate} value={selectedDate} />
      <div className="mt-4">
        <h2 className="text-2xl font-semibold">
          Tasks for {selectedDate.toDateString()}
        </h2>
        {tasksForDate.length === 0 ? (
          <p>No tasks for this date.</p>
        ) : (
          <ul>
            {tasksForDate.map((task) => (
              <li key={task._id} className="p-2 border-b">
                {task.title} {task.done ? "(Done)" : ""}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
