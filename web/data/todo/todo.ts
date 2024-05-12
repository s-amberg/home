export interface Todo {
    id: number|undefined,
    name: string,
    description: string,
    doneDate: Date|undefined,
    dueDate: Date|undefined;
    creationDate: Date;
    importance: number;
    state: 'OK'|'DELETED';
}


export interface TodoDTO extends Todo{
    doneDateTimestamp: number|undefined;
    dueDateTimestamp: number|undefined;
    creationDateTimestamp: number|undefined;
}

export class TodoConverter {

    static TodoToDTO = (todo: Todo): TodoDTO => {
        return {...todo, 
            doneDateTimestamp: todo.doneDate?.getTime(),
            dueDateTimestamp: todo.dueDate?.getTime(),
            creationDateTimestamp: todo.creationDate?.getTime(),
        }
    }

    static TodoFromDTO = (todo: TodoDTO): Todo => {
        return {
            ...todo,
            doneDate: todo.doneDateTimestamp ? new Date(todo.doneDateTimestamp) : undefined,
            dueDate: todo.dueDateTimestamp ? new Date(todo.dueDateTimestamp) : undefined,
            creationDate: todo.creationDateTimestamp ? new Date(todo.creationDateTimestamp) :  new Date(),
        }
    }

}