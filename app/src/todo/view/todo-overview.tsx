import { MDBCard, MDBCardBody, MDBCardHeader, MDBContainer, MDBIcon, MDBTable, MDBTableBody, MDBTableHead } from "mdb-react-ui-kit";
import {Todo} from "../../../../data/todo/todo"
import { TodoDAO } from "../dal/todo-dao";
import { DIContainer } from "../../DIContainer";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PaginatedTable } from "../../lib/paginated-table";
import React from "react";

export function TodoOverview() {

    const todoDAO: TodoDAO = DIContainer.getDiContainer.todoDAO;
    const [todos, setTodos] = useState<Todo[]>([]);

    
    useEffect(() => {
        const load = async () => {
            setTodos(await todoDAO.listTodos());
        }
        load();
    }, [todoDAO])
    console.info("overview render")

    const todoTable = (todos: Todo[]) => {

        return (
            <MDBTable>
                <MDBTableHead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Completed</th>
                    </tr>
                    
                </MDBTableHead>
                <MDBTableBody>
                {todos.map(todo => 
                    <tr key={todo.id}>
                        <td>{todo.id}</td>
                        <td>{todo.name}</td>
                        <td>{todo.description}</td>
                        <td>{todo.doneDate?.toLocaleDateString()}</td>
                        <td><Link to={`/todo/${todo.id}`}><MDBIcon fas icon="pen" /></Link></td>
                    </tr>
                )} 
                </MDBTableBody>
                
            </MDBTable>
        )
    }

    return (
        <MDBContainer>
            <MDBCard>
                <MDBCardHeader>
                    <h1>All Todos</h1>
                </MDBCardHeader>
                <MDBCardBody>

                    <PaginatedTable itemsPerPage={10} items={todos} table={todoTable}/>
                    
                </MDBCardBody>
            </MDBCard>
            
            
        </MDBContainer>
    )
}