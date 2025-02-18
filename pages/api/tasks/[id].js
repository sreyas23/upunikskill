// pages/api/tasks/[id].js
import { tasks } from '../../../data.js';

export default function handler(req, res) {
  const { id } = req.query;
  const { method } = req;
  const taskId = parseInt(id, 10);
  const taskIndex = tasks.findIndex((t) => t.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({ message: "Task not found" });
  }

  switch (method) {
    case "GET":
      return res.status(200).json(tasks[taskIndex]);
    case "PUT":
      const { title, description, dueDate, done } = req.body;
      if (!title) {
        return res.status(400).json({ message: "Title is required." });
      }
      tasks[taskIndex] = {
        ...tasks[taskIndex],
        title,
        description: description || "",
        dueDate: dueDate !== undefined ? dueDate : tasks[taskIndex].dueDate,
        done: Boolean(done),
      };
      return res.status(200).json(tasks[taskIndex]);
    case "DELETE":
      const deletedTask = tasks.splice(taskIndex, 1);
      return res.status(200).json(deletedTask);
    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
