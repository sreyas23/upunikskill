import { tasks } from '../../../data.js';

export default function handler(req, res) {
  const { method, query } = req;

  switch (method) {
    case "GET": {
      let result = [...tasks];

      if (query.status) {
        if (query.status === "completed") {
          result = result.filter((task) => task.done);
        } else if (query.status === "pending") {
          result = result.filter((task) => !task.done);
        }
      }

      if (query.sort) {
        if (query.sort === "dueDate") {
          result.sort((a, b) => {
            const aDue = a.dueDate ? new Date(a.dueDate) : new Date(8640000000000000);
            const bDue = b.dueDate ? new Date(b.dueDate) : new Date(8640000000000000);
            return aDue - bDue;
          });
        } else if (query.sort === "createdAt") {
          result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        }
      }

      return res.status(200).json(result);
    }

    case "POST": {
      const { title, description, done, dueDate } = req.body;
      if (!title) {
        return res.status(400).json({ message: "Title is required." });
      }
      const newTask = {
        id: tasks.length ? tasks[tasks.length - 1].id + 1 : 1,
        title,
        description: description || "",
        done: Boolean(done),
        dueDate: dueDate || null,
        createdAt: new Date().toISOString(),
      };
      tasks.push(newTask);
      return res.status(201).json(newTask);
    }

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
