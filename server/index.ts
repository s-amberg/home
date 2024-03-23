import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { TodoService } from "./src/todo/todo-service";
import { CORS } from "./src/middleware/cors";
import { TodoCtrl } from "./src/todo/todo-ctrl";

dotenv.config({
    path: "./.env"
});

const app: Express = express();
const port = process.env.PORT || 8080;
const service = new TodoService();


app.use(CORS)
new TodoCtrl(service, app);

app.get("/", (req: Request, res: Response) => {
  res.send("Todo express server");
});

app.use(express.static("build"))

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});