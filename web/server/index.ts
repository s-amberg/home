import express, { Express, Router, Request, Response } from "express";
import dotenv from "dotenv";
import { TodoService } from "./src/todo/todo-service";
import { CORS } from "./src/middleware/cors";
import { TodoCtrl } from "./src/todo/todo-ctrl";
import path from "path";

import { DB } from "./src/dal/pg";
import { TodoDAO } from "./src/todo/todo-dao";

dotenv.config({
    path: "./.env"
})

const app: Express = express()
const port = process.env.SERVER_PORT || 3000

const db = new DB()
const todoDAO = new TodoDAO(db)
const service = new TodoService(todoDAO)

app.use(CORS)

//Routing
const router: Router = express.Router()

new TodoCtrl(service, router)

app.use('/api', router)
//Routing

app.get("/", (req: Request, res: Response) => {
  res.send("Todo express server");
})

const appBaseName = '/app'
app.use(appBaseName, express.static("build"))

app.get(appBaseName + "/*", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"))
})

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`)
})