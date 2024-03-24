import Net from "net"
import { Startup } from "./startup";


/* 
sources: 
    https://www.postgresql.org/docs/current/protocol-message-formats.html#PROTOCOL-MESSAGE-FORMATS-AUTHENTICATIONKERBEROSV5
    https://www.postgresql.org/docs/current/protocol-flow.html#PROTOCOL-FLOW-START-UP
    https://ankushchadda.in/posts/postgres-understanding-the-wire-protocol/#startup-phase
    https://github.com/adelsz/pgtyped/pull/239/files#diff-30c1466f6605ea3854c9d99a3850d2a6e729af2345bdc813ec026e9358180873
    https://github.com/sunng87/pgwire/blob/master/src/messages/startup.rs
*/
export class TCPClient {
    
    port = 5432;
    host = 'localhost' 

    client = new Net.Socket();
    startup: Startup;

    logger: (m: string) => void;

    constructor(logger: (m: string) => void) {
        this.logger = (m: string) => {
            logger(m)
            console.info(m)
        }

        this.startup = new Startup(this.logger)
    }

    addMessageSegment = (StartUpMessage: Buffer, message_segment: string, position_in_buffer: number) => {

        var bytes_in_message_segment = Buffer.byteLength(message_segment);
    
        StartUpMessage.write(message_segment, position_in_buffer, StartUpMessage.length - position_in_buffer, 'utf8');
        position_in_buffer = position_in_buffer + bytes_in_message_segment;
    
        position_in_buffer = this.addNullTerminatorToMessageSegment(StartUpMessage, position_in_buffer);
    
        return position_in_buffer;
    
    };
    
    
    addNullTerminatorToMessageSegment = (StartUpMessage: Buffer, position_in_buffer: number) => {
    
        StartUpMessage.writeUInt8(0, position_in_buffer);
        position_in_buffer = position_in_buffer + 1;
    
        return position_in_buffer;
    
    };

    connect() {
        this.logger('-------------- connecting to DB --------------');
        this.client.on('connect', () => {
            this.logger('TCP connection established with the server.');

            this.write(this.startup.startupmessage(process.env.POSTGRE_USER ?? 'postgres', "todo"));
        })

        
        this.client.connect({ port: this.port, host: this.host }, () => {
            // If there is no error, the server has accepted the request and created a new 
            // socket dedicated to us.

            // The client can also receive data from the server by reading from its socket.
            this.client.on('data', (chunk) => {
                this.onRecieve(chunk)
            });

            this.client.on('end', () => {
                this.logger('Requested an end to the TCP connection');
            });
        });
    }

    write(message: Uint8Array) {
        this.logger(`writing, ${message.map(b => b).join(" ")}`)
        this.client.write(message, (error) => {console.info('tcp write error', {error})});
    }
   
    onRecieve(chunks: Buffer) {
        this.logger(`Data received from the server: ${chunks.toString()}.`);

        const getResponse = (type: string) => {
            switch(type) {
                case (this.startup.authenticationByte): return this.startup.authRequest(chunks)
            }
            return undefined
        }

        const type = chunks.readUInt8();
        this.logger(`type ${type}`)
        const response = getResponse(String.fromCharCode(type))
        if(response) this.write(response)


       
                
        // Request an end to the connection after the data has been received.
    }
    
}