import { HttpClient } from "app/src/lib/dal/http";
import { Todo, TodoDTO, TodoConverter } from "../../../../data/types/todo/todo";

export class TodoDAO {

    constructor(private readonly httpClient: HttpClient){

    }

    async listTodos(): Promise<Todo[]> {
        const todosDTO = (await this.httpClient.get("/todos")) as TodoDTO[]
        return todosDTO.map(todo => TodoConverter.TodoFromDTO(todo))
    }

    async detail(id: number): Promise<Todo|undefined> {
        const todo = (await this.httpClient.get(`/todo/${id}`)) as TodoDTO
        return TodoConverter.TodoFromDTO(todo)
    }

    async save(todo: Todo): Promise<Todo> {
        const dto = TodoConverter.TodoToDTO(todo)
        const newTodo = (await this.httpClient.post(`/todo/`, dto)) as TodoDTO

        return Promise.resolve(TodoConverter.TodoFromDTO(newTodo))
    }

}