const io = require('socket.io')
import http, { Server } from 'http'

import { Express} from "express"

export class DBFrontend {

    server: Server
    ioServer
    port = 5000
    messageQueue: Queue<string> = new Queue();

    constructor(app: Express) {
        this.server = http.createServer(app)
        this.ioServer = io(this.server, {
            cors: {origin: 'http://localhost:3000'}
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
        })
        

        
        this.server.listen(this.port, () => {
            console.log('IO Server running on Port ', this.port)
        })
    }

    sendMessage(message: string) {
        this.messageQueue.enqueue(message)
    }
}

class Queue<T> {
    private storage: T[] = [];
  
    constructor(private capacity: number = Infinity) {}
  
    enqueue(item: T): void {
      if (this.size() === this.capacity) {
        throw Error("Queue has reached max capacity, you cannot add more items");
      }
      this.storage.push(item);
    }
    dequeue(): T | undefined {
      return this.storage.shift();
    }
    size(): number {
      return this.storage.length;
    }
  }