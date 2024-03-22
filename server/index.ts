import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { TodoService } from "./src/todo/todo-service";
import { TodoDTO } from "data/todo/todo";
import { CORS } from "./src/middleware/cors";
import { TodoCtrl } from "./src/todo/todo-ctrl";

dotenv.config({
    path: "./.env"
});

const app: Express = express();
const port = process.env.PORT || 8080;
const service = new TodoService();
const todoCtrl = new TodoCtrl(service);

app.use(CORS)

app.get("/", (req: Request, res: Response) => {
  res.send("Todo express server");
});

app.get("/todos", async (req: Request, res: Response) => {
  const todos: TodoDTO[] = await todoCtrl.list();

  res.send(todos);
});

app.get("/todo/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params['id']);
  const todo: TodoDTO|undefined = await todoCtrl.detail(id);

  res.send({todo});
});

app.post("/todo", async (req: Request, res: Response) => {
  const todo = req.body.json();
  const saved: TodoDTO|undefined = await todoCtrl.save(todo);

  res.send(saved);
});


app.use(express.static("build"))

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});