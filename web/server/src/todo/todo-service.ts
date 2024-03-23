import {Todo} from 'data/todo/todo'

export class TodoService {

    constructor(){
        
    }

    static defaultTodos: Todo[] = Array.from(Array(1111).keys()).map(i => {
        const todo: Todo =  {
            id: i,
            name: `Todo ${i}`,
            description: 'A new todo',
            doneDate: i%3 === 0 ? new Date(new Date().setMonth(i%12)):  undefined,
        }

        return todo;
    })

    list(): Promise<Todo[]> {
        return Promise.resolve(TodoService.defaultTodos)
    }

    detail(id: number): Promise<Todo|undefined> {
        return Promise.resolve(TodoService.defaultTodos.find(t => t.id === id));
    }

    save(todo: Todo): Promise<Todo> {
        
        todo.id != null
            ? TodoService.defaultTodos[TodoService.defaultTodos.findIndex(t => t.id === todo.id)] = todo
            : TodoService.defaultTodos.push(todo)

        return Promise.resolve(todo);
    }
}