import { assert } from "console";
import { addNullTerminatorToMessageSegment, bin2Strings, writeString, writeStringNullTerminated } from "./utils";
import crypto from 'crypto'

export class Startup {

    clientNonce: string|undefined;

    constructor(public logger: (m: string) => void){

    }

    init(write: (message: Buffer) => void) {

    }

    startupmessage(userName: string, database: string): Buffer {

        const buffer_size = 22 + userName.length + 1 + database.length + 1 + 1;
        const startUpMessage = Buffer.alloc(buffer_size);
        let position_in_buffer = 0;
    
        position_in_buffer = startUpMessage.writeUInt32BE(buffer_size, 0);
    
        position_in_buffer = startUpMessage.writeUInt32BE(196608, position_in_buffer); //version 3.0
    
        position_in_buffer = writeStringNullTerminated(startUpMessage, "user", position_in_buffer);
        position_in_buffer = writeStringNullTerminated(startUpMessage, userName, position_in_buffer);
    
        position_in_buffer = writeStringNullTerminated(startUpMessage, "database", position_in_buffer);
        position_in_buffer = writeStringNullTerminated(startUpMessage, database, position_in_buffer);
    
        //Add the last null terminator to the buffer
        addNullTerminatorToMessageSegment(startUpMessage, position_in_buffer);

        return startUpMessage;
    }

    authenticationByte = 'R'

    scramSASLInitialResponse(user:string): Buffer {
        const method = 'SCRAM-SHA-256'
        const type = 'p'.charCodeAt(0)
        this.clientNonce = crypto.randomBytes(18).toString('base64');
        const response = `n,,n=${user},r=${this.clientNonce}`
        const length = 1 + 4 + method.length + 1 + 4 + response.length

        this.logger(`sasl initial: type ${type} length: ${length} response ${response}`)
        const buf = Buffer.alloc(length)
        let offset = buf.writeUInt8(type)
        offset = buf.writeInt32BE(length, offset)
        offset = writeStringNullTerminated(buf, method, offset)
        offset = buf.writeInt32BE(response.length + 1, offset)
        offset = writeString(buf, response, offset)

        return buf
    }

    authenticationSASL(chunks: Buffer): Buffer {
        const method = bin2Strings(chunks, 9)[0];
        this.logger(`methods: ${method.toString()}`)
        assert(method === 'SCRAM-SHA-256')
        return this.scramSASLInitialResponse(process.env.POSTGRES_USER ?? 'postgres')
    }

    authRequest(chunks: Buffer): Buffer|undefined {
        this.logger('authentication request')
        const length = chunks.readUInt32BE(1);
        const type = chunks.readUInt32BE(5);
        this.logger(`authentication request ${type} ${length} ${type}`)

        switch(type) {
            case(10): return this.authenticationSASL(chunks)
        }
        return undefined
    }
}