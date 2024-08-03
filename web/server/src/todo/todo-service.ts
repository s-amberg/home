import {Todo} from 'data/todo/todo'
import {TodoDAO} from './todo-dao';

export class TodoService {

    constructor(private readonly todoDAO: TodoDAO){
        
    }

    async list(): Promise<Todo[]> {
        return await this.todoDAO.list()
    }


    async detail(id: number): Promise<Todo|undefined> {
        return Promise.resolve(await this.todoDAO.find(id))
    }

    async save(todo: Todo): Promise<Todo> {
        const dbSaved = await this.todoDAO.save(todo)
        console.log(dbSaved)
        return dbSaved ?? todo
    }
}