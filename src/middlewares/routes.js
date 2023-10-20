import { randomUUID } from "node:crypto";
import { buildRoutePath } from "../utils/buildRoutePath.js";
import { Database } from "./database.js";
import { processCSV } from "./readingCSVFile.js";

const database = new Database();

export const routes = [
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { search } = req.query;

      const tasks = database.select(
        "tasks",
        search
          ? {
              id: search,
              title: search,
              description: search,
              completedAt: search,
              createdAt: search,
              updatedAt: search,
            }
          : null
      );

      return res.end(JSON.stringify(tasks));
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      if(!req.body){
        return res.writeHead(400).end()
      } else {
        if(!req.body.title || !req.body.description) {
          return res.writeHead(400).end()
        } else {
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
        }
      }
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      if (!req.body) {
        return res.writeHead(400).end();
      } else {
        const { title, description } = req.body;
        if (!title || !description) {
          return res.writeHead(400).end();
        }
        const id = req.params.id;
        const date = new Date();
        const task = database.selectOne("tasks", id);

        const updatedTask = {
          id: id,
          title,
          description,
          completedAt: null,
          createdAt: task.createdAt,
          updatedAt: date,
        };

        database.update("tasks", id, updatedTask);

        return res.writeHead(204).end();
      }
    },
  },
  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id/complete"),
    handler: (req, res) => {
      const id = req.params.id;
      const date = new Date();

      try {
        const task = database.selectOne("tasks", id);

        if (task.completedAt == null) {
          task.completedAt = date;
          task.updatedAt = date;

          database.update("tasks", id, task);

          return res.writeHead(200).end();
        } else {
          task.completedAt = null;
          task.updatedAt = date;
          return res.writeHead(200).end();
        }
      } catch (error) {
        return res.writeHead(400).end();
      }
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const id = req.params.id
      
      try {
        database.delete('tasks', id)
        return res.writeHead(200).end()
      }
       catch (error) {
        res.writeHead(404).end()
      }
    }
  },
  {
    method: "POST",
    path: buildRoutePath("/tasks/read-csv"),
    handler: (req, res) => {
      const csvFilePath = 'src/middlewares/csvTest.csv'

      processCSV(csvFilePath)
        .then(() => {
          res.writeHead(201).end()
        })
        .catch((err) => {
          res.writeHead(500).end()
        })
    },
  },
];
