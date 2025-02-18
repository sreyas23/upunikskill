import { useState, useEffect } from "react";
import useSWR from "swr";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const fetcher = (url) => fetch(url).then((res) => res.json());

function isSameDay(dateA, dateB) {
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  );
}

export default function CalendarPage() {
  const { data: tasks, error } = useSWR("/api/tasks", fetcher);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasksForDate, setTasksForDate] = useState([]);

  useEffect(() => {
    if (tasks) {
      const filtered = tasks.filter((task) => {
        if (!task.dueDate) return false;
        const taskDue = new Date(task.dueDate);
        return isSameDay(taskDue, selectedDate);
      });
      setTasksForDate(filtered);
    }
  }, [tasks, selectedDate]);

  // Show a small number on each tile if tasks are due that day
  const tileContent = ({ date, view }) => {
    if (view === "month" && tasks) {
      const dayTasks = tasks.filter((task) => {
        if (!task.dueDate) return false;
        const taskDue = new Date(task.dueDate);
        return isSameDay(taskDue, date);
      });
      if (dayTasks.length > 0) {
        return (
          <div className="text-xs text-red-500 font-bold">
            {dayTasks.length}
          </div>
        );
      }
    }
    return null;
  };

  if (error) return <div>Error loading tasks.</div>;
  if (!tasks) return <div>Loading tasks...</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Calendar</h1>
      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
        tileContent={tileContent}
      />
      <div className="mt-4">
        <h2 className="text-xl font-semibold">
          Tasks for {selectedDate.toDateString()}
        </h2>
        {tasksForDate.length === 0 ? (
          <p>No tasks due on this date.</p>
        ) : (
          <ul className="space-y-2">
            {tasksForDate.map((task) => (
              <li
                key={task.id || task._id}
                className="border p-2 rounded bg-gray-100"
              >
                {task.title}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
