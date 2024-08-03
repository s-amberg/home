import { MDBBtn, MDBCard, MDBCardBody, MDBCardHeader, MDBCheckbox, MDBContainer, MDBInput } from "mdb-react-ui-kit";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { DIContainer } from "../../DIContainer";
import { TodoDAO } from "../dal/todo-dao";
import { useNavigate, useParams } from "react-router-dom";
import React from "react";
import { Todo } from "data/todo/todo";
import { Loader } from "../../lib/loader";

export function TodoEdit() {
    const navigate = useNavigate();
    const {id} = useParams()
    const todoDAO: TodoDAO = DIContainer.getDiContainer.todoDAO;
    const [todo, setTodo] = useState<Todo>({id: undefined, name: '', description: '', doneDate: undefined, creationDate: new Date(), dueDate: undefined, importance: 1, state: 'OK'});
    const [isLoading, setIsLoading] = useState(false);
    const [dueDate, setDueDate] = useState<string|undefined>(undefined);

    useEffect(() => {
        const parsedId = (id ? parseInt(id) : undefined)
        const load = () => {
            if(parsedId != null) {
                setIsLoading(true)
                todoDAO.detail(parsedId).then(todo => {
                    if(todo)setTodo(todo)
                }).finally(() => setIsLoading(false));
            };
        }
        load()
    }, [id])

    useEffect(() => {
        setDueDate(getDate(todo.dueDate))
    }, [todo])

    
    const setDone = (e: ChangeEvent<HTMLInputElement>) => {
        const doneDate = e.target.checked ? new Date() : undefined;
        setTodo((previous: Todo) => ({...previous, doneDate}))
    }

    const save = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(todo) {
            const saved = await todoDAO.save(todo)
            setTodo(saved);
            navigate('/todos');
        }
    }
    const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
        
        const { name, value } = e.target;
        setTodo((previous: Todo) => ({...previous, [name]: value}))
    }
    const handleNumericFormChange = (e: ChangeEvent<HTMLInputElement>) => {
        
        const { name, value } = e.target;
        setTodo((previous: Todo) => ({...previous, [name]: +value}))
    }
    const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
        
        const { name } = e.target;
        const value: Date|null = e.target?.valueAsDate;

        if(value && !isNaN(value.getTime()) && value.getUTCFullYear() > 1000) {
            setTodo((previous: Todo) => ({...previous, [name]: new Date(value)}))
        }
        setDueDate(e.target.value)
    }

    const getDate = (key: Date|undefined) => {

        const padding = (str: number|undefined) => {
            const padded = "00" + str
            return padded.substring(padded.length-2, padded.length)
        }
        return `${key?.getUTCFullYear()??''}-${padding((key?.getUTCMonth()??0) +1)}-${padding(key?.getUTCDate())}`
    }
    
    return (
        <MDBContainer>
            {todo != null && 
            <MDBCard>
                <MDBCardHeader>
                    <h1>Edit Todo #{id}</h1>
                </MDBCardHeader>
                <MDBCardBody>
                    <Loader isLoading={isLoading}>
                        <form onSubmit={save}>
                            <MDBInput name="name" onChange={handleFormChange} value={todo.name} className='mb-4' id='Name' type='text' aria-describedby='textExample1'/>
                            <MDBInput name="description" onChange={handleFormChange} value={todo.description}  className='mb-4' label='Description' id='description' type='text' aria-describedby='textExample2'/>
                            <MDBInput name="importance" onChange={handleNumericFormChange} value={todo.importance}  className='mb-4' label='Importance' id='importance' type='number' min="0" max="10" aria-describedby='textExample3'/>
                            <MDBInput name="dueDate" onChange={handleDateChange} value={dueDate} className='mb-4' label='Due Date' id='dueDate' type='date' aria-describedby='textExample4'/>
                            <div className='mb-4'>
                                <MDBCheckbox
                                id='done-date'
                                label='Is completed'
                                checked={todo.doneDate != null}
                                onChange={(v: ChangeEvent<HTMLInputElement>) => setDone(v)}
                            /></div>
                            <MDBBtn className='mb-4' type='submit' block> Save </MDBBtn>
                        </form>
                    </Loader>
                    
                </MDBCardBody>
            </MDBCard>
            }
        
        </MDBContainer>
    )
}