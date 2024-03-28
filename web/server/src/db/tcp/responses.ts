import { assert } from "console";
import { bin2Strings } from "./utils";
import { Message } from "./client";

export class BackendKeyData {

    indicator = 'K'
    processId: number|undefined
    secretKey: number|undefined

    constructor(public logger: (m: string) => void) {

    }


    handleRequest(message: Message): Buffer|undefined {
        const chunks = message.data
        assert(message.length === 12)
        this.processId = chunks.readUInt32BE(0);
        this.secretKey = chunks.readUInt32BE(4);
        this.logger(`backend key data: ${this.processId} ${this.secretKey}`)

        return undefined
    }
}


export class ParameterStatus {

    indicator = 'S'
    parameters: Map<string, string> = new Map()

    constructor(public logger: (m: string) => void) {

    }


    handleRequest(message: Message): Buffer|undefined {
        const parameters = bin2Strings(message.data, 0, message.data.length)
        if(parameters.length === 2) {
            this.parameters.set(parameters[0], parameters[1])
        }
        this.logger(`parameter status: ${parameters}`)

        return undefined
    }
}

export class ReadyForQuery {

    indicator = 'Z'
    status: 'I'|'T'|'E' = 'I'

    constructor(public logger: (m: string) => void) {

    }


    handleRequest(message: Message): Buffer|undefined {
        assert(message.length === 5)
        const status = String.fromCharCode(message.data.readUint8());
        if(status === 'I' || status === 'T' || status === 'E') this.status = status;
        this.logger(`ready status: ${status}`)

        return undefined
    }
}
