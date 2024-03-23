export interface Todo {
    id: number|undefined,
    name: string,
    description: string,
    doneDate: Date|undefined,
}


export interface TodoDTO extends Todo{
    doneDateTimestamp: number|undefined;
}

export class TodoConverter {

    static TodoToDTO = (todo: Todo): TodoDTO => {
        return {...todo, doneDateTimestamp: todo.doneDate?.getTime()}
    }

    static TodoFromDTO = (todo: TodoDTO): Todo => {
        return {
            ...todo,
            doneDate: todo.doneDateTimestamp ? new Date(todo.doneDateTimestamp) : undefined
        }
    }

}