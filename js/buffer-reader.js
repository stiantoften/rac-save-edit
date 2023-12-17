const readBcdByte = (arr, offset) => {
    const byte = arr[offset];
    const tens = ~~(byte / 16);
    const ones = byte % 16

    return tens * 10 + ones;
}

const readUint16 = (arr, offset) => {
    return arr[offset] | arr[offset + 1] << 8
}


const readUint32 = (arr, offset) => {
    return arr[offset] | arr[offset + 1] << 8 | arr[offset + 2] << 16 | arr[offset + 3] << 24
}

const readBytes = (arr, offset, count) => {
    return arr.slice(offset, offset + count);
}