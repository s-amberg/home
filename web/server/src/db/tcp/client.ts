import Net from "net"
import { Startup } from "./startup";
import { BackendKeyData, ParameterStatus, ReadyForQuery } from "./responses";
import { Queue } from "./utils";


/* 
sources: 
    https://www.postgresql.org/docs/current/protocol-message-formats.html#PROTOCOL-MESSAGE-FORMATS-AUTHENTICATIONKERBEROSV5
    https://www.postgresql.org/docs/current/protocol-flow.html#PROTOCOL-FLOW-START-UP
    https://ankushchadda.in/posts/postgres-understanding-the-wire-protocol/#startup-phase
    https://github.com/adelsz/pgtyped/pull/239/files#diff-30c1466f6605ea3854c9d99a3850d2a6e729af2345bdc813ec026e9358180873
    https://github.com/sunng87/pgwire/blob/master/src/messages/startup.rs
*/
export type Message = {
    type: string,
    length: number,
    data: Buffer
}

export class TCPClient {

    port = parseInt(process.env.POSTGRES_PORT ?? "5432");
    host = process.env.POSTGRES_HOST
    attempts = 0;
    maxAttempts = 10;

    client = new Net.Socket();
    startup: Startup;
    backendKeyData: BackendKeyData;
    statusParameters: ParameterStatus;
    readyForQuery: ReadyForQuery;
    messageQueue: Queue<Message> = new Queue(100);

    logger: (m: string) => void;

    constructor(logger: (m: string) => void) {
        this.logger = (m: string) => {
            logger(m)
            console.info(m)
        }

        this.startup = new Startup(this.logger)
        this.backendKeyData = new BackendKeyData(this.logger)
        this.statusParameters = new ParameterStatus(this.logger)
        this.readyForQuery = new ReadyForQuery(this.logger);

        this.connectionListeners();
    }

    connectionListeners() {
        this.client.on('connect', () => {
            this.logger('TCP connection established with the server.');

            this.write(this.startup.startupmessage(process.env.POSTGRES_USER ?? 'postgres', "todo"));
        })

        this.client.on('data', (chunk) => {
            this.onRecieve(chunk)
        });

        this.client.on('end', () => {
            this.logger('Requested an end to the TCP connection');
            // this.reconnect()
        });

        this.client.on('error', (e) => {
            this.logger('Error in TCP Connection' + 'error: ' + e + e.message);
            this.reconnect()
        });
    }

    reconnect() {
        setTimeout(() => {
            this.attempts++;
            this.logger(`reconnecting to DB ${this.attempts} / ${this.maxAttempts}`)
            if(this.attempts < this.maxAttempts) this.connect()
        }, 2000)
    }

    connect() {
        this.logger(`-------------- connecting to DB ${this.host}:${this.port}--------------`);
        this.client.connect({ port: this.port, host: this.host });
    }

    write(message: Uint8Array) {
        this.logger(`writing, ${message.map(b => b).join(" ")}`)
        this.client.write(message, (error) => {if(error) console.info('tcp write error', {error})});
    }
    
    getResponse = (message: Message | undefined) => {
        if(message){
        this.logger('message: ' + message.type + ' ' + message.length + ' ' + message.data)
        switch(message.type) {
            case (this.startup.indicator): return this.startup.handleRequest(message)
            case (this.backendKeyData.indicator): return this.backendKeyData.handleRequest(message)
            case (this.statusParameters.indicator): return this.statusParameters.handleRequest(message)
            case (this.readyForQuery.indicator): return this.readyForQuery.handleRequest(message)
            case 'E': this.logger('error' + message.toString())
        }}
        return undefined
    }

    getMessages(chunks: Buffer): Message[] {
        const type = String.fromCharCode(chunks.readUInt8());
        const length = chunks.readUInt32BE(1);
        const dataStart = 1 + 4;
        const end = length + 1;
        const data = chunks.subarray(dataStart, end)

        const message = {type, length, data}
        console.info({chunks}, {data}, {length}, {end}, chunks.length)

        if(end < chunks.length) return [message, ...this.getMessages(chunks.subarray(end))]
        else return [message]
    }
   
    onRecieve(chunks: Buffer) {
        this.logger(`Data received from the server: ${chunks.toString()}.`);

        const messages = this.getMessages(chunks);
        messages.forEach(message => {
            this.messageQueue.enqueue(message)
            try {
                const response = this.getResponse(this.messageQueue.dequeue())
                if(response) this.write(response)  
            } catch(e) {
                this.logger('DB exchange error: ' + e)
                throw(e)
            }
        })

    }
    
}