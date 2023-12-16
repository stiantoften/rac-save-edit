const readBcdByte = (arr, offset) => {
    const byte = arr[offset];
    const tens = ~~(byte / 16);
    const ones = byte % 16

    return tens * 10 + ones;
}