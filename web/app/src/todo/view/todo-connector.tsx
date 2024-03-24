import { MDBBtn, MDBCard, MDBCardBody, MDBCardHeader, MDBCol, MDBContainer, MDBIcon, MDBRow } from "mdb-react-ui-kit"
import React from "react"
import {io, Socket} from 'socket.io-client'

export function DbConnector() {

    const [time, setTime] = React.useState('fetching')  
    const [message, setMessage] = React.useState<string[]>([])
    const [data, setData] = React.useState<string>('empty')
    const [socket, setSocket] = React.useState<Socket|undefined>(undefined)

    React.useEffect(()=>{
        setSocket(io('http://localhost:5000'))    
     }, [])

    React.useEffect(() => {
        if(socket) {
            socket.on('connect', ()=>console.log(socket.id))
            socket.on('connect_error', ()=>{
                setTimeout(() => socket.connect(), 5000)
            })   
            socket.on('time', (data) => setTime(data))
            socket.on('message', (data: string)=> {
                setData(data)
            })
            socket.on('disconnect',()=>setTime('server disconnected'))
        }
    }, [socket])

    React.useEffect(() => {
        const newmessage: string[] = [data, ...message]
        console.info({newmessage})
        setMessage(newmessage)
    }, [data])

    const reload = () => {
        if(socket) {
            setMessage(['---------------------- reload -----------------------', ...message])
            socket.emit('reload')
        }
    }

    return (
        <MDBContainer>
            <MDBCard>

                <MDBCardHeader>
                    <MDBRow>
                        <MDBCol><h1>DB Connector</h1></MDBCol>
                        <MDBCol className="text-end"><MDBBtn onClick={reload} tag='a'><MDBIcon fas icon="redo" size="lg"/></MDBBtn></MDBCol>
                    </MDBRow>
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