import Net from "net"

export class TCPClient {
    
    port = 5432;
    host = 'localhost' 

    client = new Net.Socket();
    logger: (m: string) => void;

    constructor(logger: (m: string) => void) {
        this.logger = (m: string) => {
            logger(m)
            console.info(m)
        }
    }

    startupmessage(userName: string, database: string): Uint8Array {

        const buffer_size = 22 + userName.length + 1 + database.length + 1 + 1;
        const startUpMessage = Buffer.alloc(buffer_size);
        let position_in_buffer = 0;
    
        startUpMessage.writeUInt32BE(buffer_size, 0);
        position_in_buffer += 4;
    
        startUpMessage.writeUInt32BE(196608, position_in_buffer); //version 3.0
        position_in_buffer += 4;
    
        position_in_buffer = this.addMessageSegment(startUpMessage, "user", position_in_buffer);
        position_in_buffer = this.addMessageSegment(startUpMessage, userName, position_in_buffer);
    
        position_in_buffer = this.addMessageSegment(startUpMessage, "database", position_in_buffer);
        position_in_buffer = this.addMessageSegment(startUpMessage, database, position_in_buffer);
    
        //Add the last null terminator to the buffer
        this.addNullTerminatorToMessageSegment(startUpMessage, position_in_buffer);
    
        this.logger("The StartUpMessage looks like this in Hexcode: " + startUpMessage.toString('hex'));
        this.logger("The length of the StartupMessage in Hexcode is: " + startUpMessage.toString('hex').length);
    

        
        return startUpMessage;
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
        this.client.on('connect', () => {
            this.logger('TCP connection established with the server.');

            this.write(this.startupmessage("simon", "todo"));
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
        this.logger(`writing, ${message}`)
        this.client.write(message, (error) => {console.info('tcp write error', {error})});
    }
   
    onRecieve(chunks: Buffer) {
        this.logger(`Data received from the server: ${chunks.toString()}.`);

        const type = chunks.readUInt8();
        this.logger(`type ${type}`)
        switch(String.fromCharCode(type)) {
            case 'R': this.authRequest(chunks)
        }
                
        // Request an end to the connection after the data has been received.
    }

    authRequest(chunks: Buffer) {
        this.logger('authentication request')
        const type = chunks.readUInt8(0);
        const length = chunks.readUInt32BE(1);
        const third = chunks.readUInt32BE(5);

        this.logger(`authentication request ${type} ${length} ${third}`)
    }
    
}