import {Todo} from 'data/todo/todo'
import { TodoDAO } from './todo-dao';

export class TodoService {

    constructor(private todoDAO: TodoDAO){
        
    }

    static defaultTodos: Todo[] = Array.from(Array(1111).keys()).map(i => {
        const todo: Todo =  {
            id: i,
            name: `Todo ${i}`,
            description: 'A new todo',
            doneDate: i%3 === 0 ? new Date(new Date().setMonth(i%12)):  undefined,
            creationDate: new Date(new Date().getTime() - i*1000*60*60*24),
            dueDate: i%3 === 0 ? new Date(new Date().getTime() + 0.1*i*1000*60*60*24):  undefined,
            state: 'OK',
            importance: i % 10
        }

        return todo;
    })

    async list(): Promise<Todo[]> {
        const todos = await this.todoDAO.list();
        console.log({todos})
        return todos;
        return Promise.resolve(TodoService.defaultTodos)
    }

    detail(id: number): Promise<Todo|undefined> {
        return Promise.resolve(TodoService.defaultTodos.find(t => t.id === id));
    }

    async save(todo: Todo): Promise<Todo> {
        const dbSaved = await this.todoDAO.save(todo);
        console.log(dbSaved)
        return dbSaved ?? todo;
        
        todo.id != null
            ? TodoService.defaultTodos[TodoService.defaultTodos.findIndex(t => t.id === todo.id)] = todo
            : TodoService.defaultTodos.push(todo)

        return Promise.resolve(todo);
    }
}