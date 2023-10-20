import { randomUUID } from "node:crypto";
import { buildRoutePath } from "../utils/buildRoutePath.js";
import { Database } from "./database.js";

const database = new Database();

export const routes = [
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { search } = req.query;

      const tasks = database.select("tasks", search ? {
        id: search,
        title: search,
        description: search,
        completedAt: search,
        createdAt: search,
        updatedAt: search,
      } : null );

      return res.end(JSON.stringify(tasks))
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { title, description } = req.body;
      const date = new Date();

      const task = {
        id: randomUUID(),
        title,
        description,
        completedAt: null,
        createdAt: date,
        updatedAt: date,
      };

      database.insert("tasks", task);

      return res.writeHead(201).end();
    },
  },
];
