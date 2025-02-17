// pages/api/tasks/[id].js
import { tasks } from '../../../data.js';  // Adjust the relative path as needed

export default function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;
  const taskId = parseInt(id, 10);
  const taskIndex = tasks.findIndex((t) => t.id === taskId);
  if (taskIndex === -1) {
    return res.status(404).json({ message: "Task not found" });
  }
  switch (method) {
    case "GET":
      return res.status(200).json(tasks[taskIndex]);
    case "PUT":
      const { title, description, done } = req.body;
      if (!title) {
        return res.status(400).json({ message: "Title is required." });
      }
      tasks[taskIndex] = { ...tasks[taskIndex], title, description: description || "", done: Boolean(done) };
      return res.status(200).json(tasks[taskIndex]);
    case "DELETE":
      const deletedTask = tasks[taskIndex];
      tasks.splice(taskIndex, 1);
      return res.status(200).json(deletedTask);
    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
