import { assert } from "console";
import { addNullTerminatorToMessageSegment, bin2String, bin2Strings, writeString, writeStringNullTerminated } from "./utils";
import crypto from 'crypto'
import { Message } from "./client";

// scram: https://datatracker.ietf.org/doc/html/rfc5802#section-5
export class Startup {

    indicator = 'R'
    clientNonce: string|undefined;
    serverSignature: string|undefined;

    constructor(public logger: (m: string) => void){

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


    clientFirstMessageBare= () => 'n=*,r=' + this.clientNonce;
    getSASLAttribute(parts: string[], key: string) {
        return parts.find(p => p.startsWith(`${key}=`))?.substring(2)
    }

    scramSASLInitialResponse(user:string): Buffer {
        const method = 'SCRAM-SHA-256'
        const type = 'p'.charCodeAt(0)
        this.clientNonce = crypto.randomBytes(18).toString('base64');
        const response = `n,,${this.clientFirstMessageBare()}`
        const length = 4 + method.length + 1 + 4 + response.length

        const buf = Buffer.alloc(length + 1)
        let offset = buf.writeUInt8(type)
        offset = buf.writeInt32BE(length, offset)
        offset = writeStringNullTerminated(buf, method, offset)
        offset = buf.writeInt32BE(response.length, offset)
        offset = writeString(buf, response, offset)

        return buf
    }

    authenticationSASL(chunks: Buffer): Buffer {
        const method = bin2Strings(chunks, 0, chunks.length)[0];
        assert(method.startsWith('SCRAM-SHA-256'))
        return this.scramSASLInitialResponse(process.env.POSTGRES_USER ?? 'postgres')
    }

    H(clientKey: Buffer): Buffer {
        return crypto.createHash('sha256').update(clientKey).digest();
    }

    HMAC(key: Buffer, msg: string | Buffer) {
        return crypto.createHmac('sha256', key).update(msg).digest();
    }

    Hi(password: Buffer, saltBytes: Buffer, iterations: number) {
        // apply iterations to the password with salt(ui), constantly XOR with last hmac (hi)
        let ui = this.HMAC(
          password,
          Buffer.concat([saltBytes, Buffer.from([0, 0, 0, 1])]),
        );
        let hi = ui;
        for (let i = 0; i < iterations - 1; i++) {
          ui = this.HMAC(password, ui);
          hi = this.xorBuffers(hi, ui);
        }
      
        return hi;
    }

    xorBuffers(a: Buffer, b: Buffer): Buffer {
        if (!Buffer.isBuffer(a)) a = Buffer.from(a);
        if (!Buffer.isBuffer(b)) b = Buffer.from(b);
        const res = [];
        if (a.length > b.length) {
          for (let i = 0; i < b.length; i++) {
            res.push(a[i] ^ b[i]);
          }
        } else {
          for (let j = 0; j < a.length; j++) {
            res.push(a[j] ^ b[j]);
          }
        }
        return Buffer.from(res);
    }

    nullTerminatedString = (str: string): Buffer => {
        const buf = Buffer.concat([Buffer.from(str, 'utf8'), Buffer.from([0])]);
        return buf;
    };

    SASLcontinue(password: string, chunks: Buffer): Buffer {
        const serverResponseBare = bin2String(chunks, 0, chunks.length)[0];
        const parts = serverResponseBare.split(',')
        const serverNonce: string | undefined = this.getSASLAttribute(parts, 'r');
        const serverSalt: string | undefined = this.getSASLAttribute(parts, 's');
        const iteration: number | undefined = parseInt(this.getSASLAttribute(parts, 'i') ?? "NaN");
      
        if (!(serverSalt && serverNonce && iteration)) {
          throw new Error('SASL: SCRAM-SERVER-FIRST-MESSAGE: nonce, salt or iteration missing');
        }
        
        if (!this.clientNonce || !serverNonce.startsWith(this.clientNonce)) {
            throw new Error(
            'SASL: SCRAM-SERVER-FIRST-MESSAGE: server nonce does not start with client nonce',
            );
        }

        //https://datatracker.ietf.org/doc/html/rfc5802#section-5
        const passwordBytes = this.nullTerminatedString(password);
        const saltBytes = Buffer.from(serverSalt, 'base64');
        const saltedPassword = this.Hi(passwordBytes, saltBytes, iteration);
      
        const clientKey = this.HMAC(saltedPassword, 'Client Key');
        const storedKey = this.H(clientKey);

        const clientFirstMessageBare = this.clientFirstMessageBare();
        const serverFirstMessage = serverResponseBare;       
        const clientFinaLMessageWithoutProof =  `c=biws,r=${serverNonce}`

        const authMessage = clientFirstMessageBare + "," + serverFirstMessage + "," + clientFinaLMessageWithoutProof

        const clientSignature = this.HMAC(storedKey, authMessage);
        const clientProofBytes = this.xorBuffers(clientKey, clientSignature);
        const clientProof = clientProofBytes.toString('base64');

        const serverKey  = this.HMAC(saltedPassword, "Server Key")
        this.serverSignature = this.HMAC(serverKey, authMessage).toString('base64');

        const response = `${clientFinaLMessageWithoutProof},p=${clientProof}`
        
        const length = 4 + response.length
        const buf = Buffer.alloc(length + 1)
        let offset = buf.writeUInt8('p'.charCodeAt(0))
        offset = buf.writeInt32BE(length, offset)
        offset = writeString(buf, response, offset)

        this.logger('SASL continue: ' + response)

        return buf
    }   

    SASLfinal(chunks: Buffer) {
        const dataStart = 0;
        const serverSignature = bin2String(chunks, dataStart, chunks.length)[0];

        const serverSignatureFromServer = this.getSASLAttribute(serverSignature.split(','), 'v')
        if (!serverSignatureFromServer) {
            throw new Error('SASL-FINAL: server signature is missing',);
        }
        if (this.serverSignature !== serverSignatureFromServer) {
            throw new Error('SASL-FINAL: server signature does not match',);
        }

        this.logger('SASL final successful')
    }

    authenticationOk() {
        this.logger('authentication successful')
    }


    handleRequest(message: Message): Buffer|undefined|void {
        const type = message.data.readUInt32BE();
        const chunks = message.data.subarray(4, message.data.length);
        this.logger(`authentication request ${message.type} ${message.length} ${type}`)

        switch(type) {
            case(0):  return this.authenticationOk()
            case(10): return this.authenticationSASL(chunks)
            case(11): return this.SASLcontinue(process.env.POSTGRES_PW ?? "", chunks)
            case(12): return this.SASLfinal(chunks)
        }
        return undefined
    }
}