import { MDBBtn, MDBCard, MDBCardBody, MDBCardHeader, MDBCheckbox, MDBContainer, MDBInput } from "mdb-react-ui-kit";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { DIContainer } from "../../DIContainer";
import { TodoDAO } from "../dal/todo-dao";
import { useParams } from "react-router-dom";
import React from "react";
import { Todo } from "data/todo/todo";

export function TodoEdit() {
    const {id} = useParams()
    const [todo, setTodo] = useState<Todo>({id: 0, name: " ", description: " ", doneDate: undefined});
    const [todoDAO, _] = useState<TodoDAO>(DIContainer.getDiContainer.todoDAO);
    
    useEffect(() => {
        const parsedId = (id ? parseInt(id) : undefined)
        const load = async () => {
            if(parsedId != null) {
                const dbTodo = await todoDAO.detail(parsedId);
                if(dbTodo) setTodo(dbTodo)
            };
        }
        load()
    }, [id, todoDAO])

    
    const setDone = (e: ChangeEvent<HTMLInputElement>) => {
        const doneDate = e.target.checked ? new Date() : undefined;
        setTodo((previous: Todo) => ({...previous, doneDate}))
    }

    const save = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(todo) setTodo(await todoDAO.save(todo));
    }
    const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
        
        const { name, value } = e.target;
        setTodo((previous: Todo) => ({...previous, [name]: value}))
    }
    
    return (
        <MDBContainer>
            {todo != null && 
            <MDBCard>
                <MDBCardHeader>
                    <h1>Edit Todo #{todo.id}</h1>
                </MDBCardHeader>
                <MDBCardBody>
                    <form onSubmit={save}>
                        <MDBInput name="name" onChange={handleFormChange} value={todo.name} className='mb-4' id='Name' type='text' aria-describedby='textExample1'/>
                        <MDBInput name="description" onChange={handleFormChange} value={todo.description}  className='mb-4' label='Description' id='description' type='text' aria-describedby='textExample2'/>
                        <div className='mb-4'>
                            <MDBCheckbox
                            id='done-date'
                            label='Is completed'
                            checked={todo.doneDate != null}
                            onChange={(v: ChangeEvent<HTMLInputElement>) => setDone(v)}
                        /></div>
                        <MDBBtn className='mb-4' type='submit' block> Save </MDBBtn>
                    </form>
                </MDBCardBody>
            </MDBCard>
            }
        
        </MDBContainer>
    )
}