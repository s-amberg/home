import { TodoService } from "./todo-service";
import { Todo, TodoDTO, TodoConverter } from '../../../data/types/todo/todo';
import { Controller } from "../middleware/controller";
import { Express, Request, Response, Router } from "express";

export class TodoCtrl extends Controller<Todo, TodoDTO> {



    protected fromDTO = TodoConverter.TodoFromDTO
    protected toDTO = TodoConverter.TodoToDTO

    constructor(private todoService: TodoService, app: Router) {
        super(app);
    }

    protected routes(app: Express): void {

        app.get("/todos", async (req: Request, res: Response) => {
            const todos = await this.todoService.list()
            const todoDTOS = todos.map(t => TodoConverter.TodoToDTO(t))
            res.json(todoDTOS);
        });
          
        app.get("/todo/:id", async (req: Request, res: Response) => {
            const id = parseInt(req.params['id']);
                  const todo = await this.todoService.detail(id)
                  res.json(todo)
        });
          
        super.post(app, "/todo", Controller.jsonParser)(async (todo: Todo, req: Request) => {
            const savedTodo = await this.todoService.save(todo)
            return savedTodo
        });
    }
    
}