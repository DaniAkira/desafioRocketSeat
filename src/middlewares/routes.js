import { buildRoutePath } from "../utils/buildRoutePath.js";
import { Database } from "./database.js";


const database = new Database()

export const routes = [
    {
        method: "GET",
        path: buildRoutePath("/task"),
        handler: (req, res) => {
            const { search } = req.query

            const tasks = 0
        }
    },
]
