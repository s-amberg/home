import { HttpClient } from "app/src/lib/dal/http";
import { Todo, TodoDTO, TodoFromDTO, TodoToDTO } from "../../../../data/types/todo/todo";

export class TodoDAO {

    constructor(private httpClient: HttpClient){

    }

    async listTodos(): Promise<Todo[]> {
        const todosDTO = (await this.httpClient.get("/todos")) as TodoDTO[]
        const todos = todosDTO.map(todo => TodoFromDTO(todo));

        console.info({todos})
        return todos;
    }

    async detail(id: number): Promise<Todo|undefined> {
        const todo = (await this.httpClient.get(`/todo/${id}`)) as TodoDTO
        return TodoFromDTO(todo);  
    }

    async save(todo: Todo): Promise<Todo> {
        const dto = TodoToDTO(todo)
        const newTodo = (await this.httpClient.post(`/todo/`, dto)) as TodoDTO

        return Promise.resolve(TodoFromDTO(newTodo));
    }

}