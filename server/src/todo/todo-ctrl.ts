import { TodoService } from "./todo-service";
import { Todo } from 'data/todo/todo';

export class TodoCtrl {

    constructor(private todoService: TodoService) {

    }
    // async list(): Promise<TodoDTO[]> {
    //     const todos = await this.todoService.list()
    //     return todos.map(t => TodoToDTO(t))
    // }

    // async detail(id: number): Promise<TodoDTO|undefined> {
    //     const todo = await this.todoService.detail(id)
    //     return todo ? TodoToDTO(todo) : undefined;
    // }

    // async save(todo: TodoDTO): Promise<TodoDTO> {
    //     const fromRequest: Todo = TodoFromDTO(todo)
    //     const savedTodo = await this.todoService.save(fromRequest)
    //     return TodoToDTO(savedTodo);
    // }
    async list(): Promise<Todo[]> {
        return this.todoService.list()
    }

    async detail(id: number): Promise<Todo|undefined> {
        return this.todoService.detail(id)
    }

    async save(todo: Todo): Promise<Todo> {
        return this.todoService.save(todo)
    }
}