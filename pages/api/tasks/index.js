// pages/api/tasks/index.js
import { tasks } from '../../../data.js';  // Adjust the relative path as needed

export default function handler(req, res) {
  const { method } = req;
  switch (method) {
    case "GET":
      // Return all tasks
      return res.status(200).json(tasks);
    case "POST":
      const { title, description, done } = req.body;
      if (!title) {
        return res.status(400).json({ message: "Title is required." });
      }
      const newTask = {
        id: tasks.length ? tasks[tasks.length - 1].id + 1 : 1,
        title,
        description: description || "",
        done: Boolean(done),
      };
      tasks.push(newTask);
      return res.status(201).json(newTask);
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
