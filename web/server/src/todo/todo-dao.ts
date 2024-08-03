import { Todo } from "data/todo/todo";
import { DB } from "../dal/pg";
import { QueryResult } from "pg";

interface TodoRow {
    id: number
    name: string
    description: string
    done_date: Date|null
    due_date: Date|null
    creation_date: Date
    importance: number
    state: 'OK'|'DELETED'
}

export class TodoDAO {

    constructor(private readonly db: DB){

    }

    private static rowToTodo = (row: TodoRow): Todo => {
        return {
            id: row.id,
            name: row.name,
            description: row.description,
            doneDate: row.done_date ?? undefined,
            dueDate: row.due_date ?? undefined,
            creationDate: row.creation_date,
            importance: row.importance,
            state: row.state,
        }
    }

    async list(): Promise<Todo[]> {
        try {
            const result = await this.db.query("select * from todo", undefined)
            return result.rows.map(row => TodoDAO.rowToTodo(row))
        } catch(e) {
            return []
        }

    }
    
    async find(id: number): Promise<Todo|undefined>{
        try {
            const result = await this.db.query(`select * from todo where id = ${id}`, undefined)
            if (result.rows.length > 0) {
                return TodoDAO.rowToTodo(result.rows[0]);
            } else {
                return undefined;
            }
        }catch(e) {
            return undefined
        }
    }

    
    private async createQuery(todo: Todo): Promise<QueryResult<any>> {
        const values = [todo.name, todo.description, todo.doneDate, todo.dueDate, todo.creationDate, todo.importance, todo.state];
        return this.db.query(
            `insert into todo(name, description, done_date, due_date, creation_date, importance, state) values($1, $2, $3, $4, $5, $6, $7) returning *;`,
            values
        );
    }
    
    private async upsertQuery(todo: Todo): Promise<QueryResult<any>> {

        const values = [todo.id, todo.name, todo.description, todo.doneDate, todo.dueDate, todo.creationDate, todo.importance, todo.state]
    
        return this.db.query(
            `insert into todo values($1, $2, $3, $4, $5, $6, $7, $8)
            on conflict(id)
            do update set
                id = EXCLUDED.id,
                name = EXCLUDED.name,
                description = EXCLUDED.description,
                done_date = EXCLUDED.done_date,
                due_date = EXCLUDED.due_date,
                creation_date = EXCLUDED.creation_date,
                importance = EXCLUDED.importance,
                state = EXCLUDED.state returning *;`, 
            values
        )
    }

    async save(todo: Todo): Promise<Todo|undefined> {
        try {            
            const result = await (todo.id != null ? this.upsertQuery(todo) : this.createQuery(todo))
            const todoRow = result.rows[0] as TodoRow
            return TodoDAO.rowToTodo(todoRow)

        } catch(e) {
            console.error(e)
            return undefined
        }

    }
}