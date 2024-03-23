import { TodoService } from "./todo-service";
import { Todo, TodoDTO, TodoConverter } from '../../../data/types/todo/todo';
import { Controller } from "../middleware/controller";
import { Express, Request, Response } from "express";

export class TodoCtrl extends Controller<Todo, TodoDTO> {

    protected routes(app: Express): void {

        app.get("/todos", async (req: Request, res: Response) => {
            const todos = await this.todoService.list()
            const todoDTOS = todos.map(t => TodoConverter.TodoToDTO(t))
            res.json(todoDTOS);
        });
          
        super.get(app, "/todo/:id")(async (req: Request) => {
            const id = parseInt(req.params['id']);
            const todo = await this.todoService.detail(id)
            
            return todo 
                ? Promise.resolve(todo) 
                : Promise.reject("not found")
        });
          
        super.post(app, "/todo", Controller.jsonParser)(async (todo: Todo, req: Request) => {
            const savedTodo = await this.todoService.save(todo)
            return savedTodo
        });
    }

    protected fromDTO = TodoConverter.TodoFromDTO
    protected toDTO = TodoConverter.TodoToDTO

    constructor(private todoService: TodoService, app: Express) {
        super(app);
    }

}