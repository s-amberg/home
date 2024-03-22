export interface Todo {
    id: number|undefined,
    name: string,
    description: string,
    doneDate: Date|undefined,
}


export interface TodoDTO extends Todo{
    doneDateTimestamp: number|undefined
}

export const TodoToDTO = (todo: Todo): TodoDTO => {
    return {...todo, doneDateTimestamp: todo.doneDate?.getTime()}
}

export const TodoFromDTO = (todo: TodoDTO): Todo => {
    return {
        ...todo,
        doneDate: todo.doneDateTimestamp ? new Date(todo.doneDateTimestamp) : undefined
    }
}