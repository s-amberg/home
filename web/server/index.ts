import express, { Express, Router, Request, Response } from "express";
import dotenv from "dotenv";
import { TodoService } from "./src/todo/todo-service";
import { CORS } from "./src/middleware/cors";
import { TodoCtrl } from "./src/todo/todo-ctrl";
import path from "path";
import { DBFrontend } from "./src/db/frontend";
import { TCPClient } from "./src/db/tcp/client";

dotenv.config({
    path: "./.env"
});

const app: Express = express();
const port = process.env.PORT || 8080;
const service = new TodoService();

app.use(CORS)

//Routing
const router: Router = express.Router()

new TodoCtrl(service, router);

app.use('/api', router)
//Routing

const ioSocket = new DBFrontend(app)
new TCPClient((m: string) => ioSocket.sendMessage(m)).connect()

app.get("/", (req: Request, res: Response) => {
  res.send("Todo express server");
});

const appBaseName = '/app'
app.use(appBaseName, express.static("build"))

// app.use(appBaseName, express.static(path.join(__dirname, "build", "index.html")))
app.get(appBaseName + "/*", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});