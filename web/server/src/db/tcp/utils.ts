export const bin2String = (array: Buffer, start: number): [string, number] => {
    let result = "";

    const charCode = array.readUInt8(start)
    if(charCode === 0) return [result, start + 1]
    else {
        const [rest, end]  = bin2String(array, start + 1)
        return [result + String.fromCharCode(charCode) + rest, end]
    }
}

export const bin2Strings = (array: Buffer, start: number): string[] => {
    
    let current = start;
    const result = [];

    while(current < array.length) {
        const [currentString, end] = bin2String(array, current)
        current = end;
        result.push(currentString);
    }

    return result
}

export const writeString = (buffer: Buffer, message_segment: string, position_in_buffer: number) => {
    var bytes_in_message_segment = Buffer.byteLength(message_segment);

    buffer.write(message_segment, position_in_buffer, buffer.length - position_in_buffer, 'utf8');
    position_in_buffer = position_in_buffer + bytes_in_message_segment;

    return position_in_buffer;
}
export const writeStringNullTerminated = (buffer: Buffer, message_segment: string, position_in_buffer: number) => {

    position_in_buffer = writeString(buffer, message_segment, position_in_buffer)

    position_in_buffer = addNullTerminatorToMessageSegment(buffer, position_in_buffer);

    return position_in_buffer;

};


export const addNullTerminatorToMessageSegment = (StartUpMessage: Buffer, position_in_buffer: number) => {

    StartUpMessage.writeUInt8(0, position_in_buffer);
    position_in_buffer = position_in_buffer + 1;

    return position_in_buffer;

};