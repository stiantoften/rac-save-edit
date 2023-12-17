const PARITY_LENGTH = 0x10;

const readPs2 = (/** @type {Uint8Array} */ arr) => {
    const decoder = new TextDecoder();

    const magic = decoder.decode(arr.buffer.slice(0, 0x1c));
    if (magic !== "Sony PS2 Memory Card Format ") {
        throw Error("Invalid magic")
    }

    const version = decoder.decode(arr.buffer.slice(0x1c, 0x23));
    if (version !== "1.2.0.0") {
        throw Error("Invalid version")
    }

    const pageLength = readUint16(arr, 0x28)
    const pagesPerCluster = readUint16(arr, 0x2a)
    const pagesPerBlock = readUint16(arr, 0x2c)
    const clusterCount = readUint32(arr, 0x30)
    const allocStart = readUint32(arr, 0x34)
    const allocEnd = readUint32(arr, 0x38)
    const rootDirClusterNum = readUint32(arr, 0x3c)
    const bblock1 = readUint32(arr, 0x40)
    const bblock2 = readUint32(arr, 0x44)
    const indFatTableTable = readBytes(arr, 0x50, 0x80)

    const clusterSize = (pageLength + PARITY_LENGTH) * pagesPerCluster

    const readCluster = (num) => {
        return new Uint8Array([
            ...readBytes(arr, num * clusterSize, clusterSize / 2 - PARITY_LENGTH),
            ...readBytes(arr, num * clusterSize + clusterSize / 2, clusterSize / 2 - PARITY_LENGTH)
        ])
    }

    const readDate = (arr, offset) => {
        const second = arr[offset + 0x01];
        const minute = arr[offset + 0x02];
        const hour = arr[offset + 0x03];

        const day = arr[offset + 0x04];
        const month = arr[offset + 0x05];
        const year = readUint16(arr, offset + 0x06)

        return new Date(year, month - 1, day, hour, minute, second)
    }

    const indFatTableCluster = readCluster(indFatTableTable[0]);
    indFatTable = [];
    for (let i = 0; i < indFatTableCluster.length; i += 4) {
        const val = readUint32(indFatTableCluster, i);
        if (val == -1) {
            break;
        }
        indFatTable.push(val)
    }

    fatTable = [];
    for (let i = 0; i < indFatTable.length; i++) {
        fatTable.push(...readCluster(indFatTable[i]))
    }

    const getFiles = (cluster) => {
        const files = [];
        for (let i = 0; i < 2; i++) {
            const ioffset = (i * (clusterSize / 2 - PARITY_LENGTH))


            const modeBytes = readUint16(cluster, ioffset + 0)
            if (modeBytes == 0xffff) {
                break;
            }
            let mode = '';
            let type = '';
            if (modeBytes & 0x0001) mode += 'R'
            if (modeBytes & 0x0002) mode += 'W'
            if (modeBytes & 0x0004) mode += 'X'
            if (modeBytes & 0x0010) type = 'file'
            if (modeBytes & 0x0020) type = 'directory'

            const name = decoder.decode(cluster.slice(ioffset + 0x40, ioffset + 0x60)).split('\u0000')[0]
            const length = readUint32(cluster, ioffset + 0x04);
            const created = readDate(cluster, ioffset + 0x08)
            const firstCluster = readUint32(cluster, ioffset + 0x10);
            const dirEntry = readUint32(cluster, ioffset + 0x14)
            const modified = readDate(cluster, ioffset + 0x18)


            const content = [];

            if (type === 'directory' && name !== "." && name !== "..") {
                let link = firstCluster;
                content.push(...getFiles(readCluster(allocStart + link)))
                for (let i = 0; i < 9999; i++) {
                    link = readUint16(fatTable, 4 * link)
                    if (link === 0xffff) break;

                    content.push(...getFiles(readCluster(allocStart + link)))
                }
            }

            if (type === 'file') {
                let link = firstCluster;
                content.push(...readCluster(allocStart + link))
                for (let i = 0; i < 9999; i++) {
                    link = readUint16(fatTable, 4 * link)
                    if (link === 0xffff) break;
                    content.push(...readCluster(allocStart + link))
                }
            }

            files.push({ name, mode, type, length, created, modified, firstCluster, dirEntry, content })
        }
        return files;
    }

    const rootDir = getFiles(readCluster(allocStart + rootDirClusterNum + 1))[0]


    return {
        magic, version, pageLength, pagesPerCluster, pagesPerBlock,
        clusterCount, allocStart, allocEnd, clusterRootDir: rootDirClusterNum, bblock1,
        bblock2, indFatTable, fatTable, rootDir
    }
}