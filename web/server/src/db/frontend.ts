const io = require('socket.io')
import http, { Server } from 'http'

import { Express} from "express"
import { Queue } from './tcp/utils'

export class DBFrontend {

    server: Server
    ioServer
    port = process.env.IO_PORT
    messageQueue: Queue<string> = new Queue();

    constructor(app: Express) {
        this.server = http.createServer(app)
        this.ioServer = io(this.server, {
            cors: {origin: `http://localhost:${process.env.PORT}`}
        })

        this.ioServer.on('connection', (socket: any)=>{
        
            console.log('client connected: ', socket.id)

            const interval = setInterval(() => {
                this.ioServer.to('clock-room').emit('time', new Date())
                const message = this.messageQueue.dequeue()
                if(message)this.ioServer.to('clock-room').emit('message', message)
            } , 1000)

            socket.join('clock-room')
        
            socket.on('disconnect', (reason: any)=>{
                console.log(reason)
                clearInterval(interval)
            })
        
            socket.on('reload', (reason: any)=>{
                console.log('reload')
                this.messageQueue.history.forEach(historyEntry => {
                  this.ioServer.to('clock-room').emit('message', historyEntry)
                })
            })
        })
        

        
        this.server.listen(this.port, () => {
            console.log('IO Server running on Port ', this.port)
        })
    }

    sendMessage(message: string) {
        this.messageQueue.enqueue(message)
    }
}