import { MDBCard, MDBCardBody, MDBCardHeader, MDBContainer, MDBIcon, MDBTable, MDBTableBody, MDBTableHead } from "mdb-react-ui-kit";
import {Todo} from "data/todo/todo"
import { TodoDAO } from "../dal/todo-dao";
import { DIContainer } from "../../DIContainer";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PaginatedTable } from "../../lib/paginated-table";
import React from "react";
import { Loader } from "../../lib/loader";

export function TodoOverview() {

    const [todoDAO, _] = useState<TodoDAO>(DIContainer.getDiContainer.todoDAO);
    const [todos, setTodos] = useState<Todo[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [sortKey, setSortKey] = useState<keyof Todo>('id');
    const [asc, setAsc] = useState(true);

    
    useEffect(() => {
        const load = () => {
            
            setIsLoading(true);
            todoDAO.listTodos().then(todos => {
                setIsLoading(false);
                setTodos(todos);
            }).catch(e => setIsLoading(false))
            
        }
        load();
    }, [todoDAO])
    
    useEffect(() => {
        const sort = () => {
            
            const newTodos = [...todos].sort((a, b) => {
                const aProperty = a[sortKey]
                const bProperty = b[sortKey]

                const greater: number = asc ? -1 : 1
    
                if(aProperty == null) return -greater;
                if(bProperty == null) return greater;

                return aProperty < bProperty ? greater : -greater
            });
            setTodos(newTodos);
        }

        sort();

    }, [sortKey, asc])

    const onSortClicked = (newSortKey: keyof Todo) => {
        setAsc(sortKey === newSortKey ? !asc : true)
        setSortKey(newSortKey);
    }

    const sortClass = (columnSortKey: keyof Todo) => {
        const isAcive = columnSortKey === sortKey
        if(!isAcive) return ""
        else return asc ? 'asc' : 'desc'
    }

    const todoTable = (todos: Todo[]) => {

        return (
            <MDBTable hover responsive>
                <MDBTableHead>
                    <tr>
                        <th className={"sortable " + sortClass('id') } onClick={() => onSortClicked('id')}>#</th>
                        <th className={"sortable " + sortClass('name') } onClick={() => onSortClicked('name')}>Name</th>
                        <th className={"sortable " + sortClass('description') } onClick={() => onSortClicked('description')}>Description</th>
                        <th className={"sortable " + sortClass('doneDate') } onClick={() => onSortClicked('doneDate')}>Completed</th>
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

                    <Loader isLoading={isLoading}><PaginatedTable itemsPerPage={10} items={todos} table={todoTable}/></Loader>
                    
                </MDBCardBody>
            </MDBCard>
            
            
        </MDBContainer>
    )
}