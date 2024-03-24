import { MDBCard, MDBCardBody, MDBCardHeader, MDBCol, MDBContainer, MDBRow } from "mdb-react-ui-kit"
import React from "react"
import {io} from 'socket.io-client'

export function Engravings() {

    const [time, setTime] = React.useState('fetching')  
    const [message, setMessage] = React.useState<string[]>([])
    const [data, setData] = React.useState<string>('empty')

    React.useEffect(()=>{
        const socket = io('http://localhost:5000')    
        socket.on('connect', ()=>console.log(socket.id))
        socket.on('connect_error', ()=>{
          setTimeout(()=>socket.connect(),5000)
        })   
        socket.on('time', (data)=>setTime(data))
        socket.on('message', (data: string)=> {
            setData(data)
        })
        socket.on('disconnect',()=>setTime('server disconnected'))
     
     }, [])

    React.useEffect(() => {
        const newmessage: string[] = [data, ...message]
        console.info({newmessage})
        setMessage(newmessage)
    }, [data])

    return (
        <MDBContainer>
            <MDBCard>

                <MDBCardHeader>
                <h1>Engravings</h1>
                </MDBCardHeader>

                <MDBCardBody>
                    time: {time}

                    {message.map((message, index) => 
                        <MDBRow><MDBCol key={index}>m: {message}</MDBCol></MDBRow>
                    )}
                    
                </MDBCardBody>

            </MDBCard>
        
        </MDBContainer>
    )
}