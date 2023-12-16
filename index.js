
const saveInput = document.getElementById('save-input');
const editorArea = document.getElementById('editor');

// https://stackoverflow.com/questions/40031688/javascript-arraybuffer-to-hex
function buf2hex(buffer) { // buffer is an ArrayBuffer
    return [...buffer]
        .slice(0, 0x100)
        .map(x => x.toString(16).padStart(2, '0'))
        .join(' ');
}

const readFile = (file) => new Promise((resolve, reject) => {
    var reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = (e) => {
        resolve(e.target.result);
    }
});

saveInput.addEventListener('change', async () => {
    console.log('changed')
    const file = saveInput.files[0];
    if (!file) return;

    const ab = await readFile(file);
    const arr = new Uint8Array(ab);

    editor.innerHTML += `<br><div class=hex>${buf2hex(arr)}</div>`
    editor.innerHTML += `<br><div>Bolt count: ${arr[0x24]}</div>`
    editor.innerHTML += `<br><div>Date: ${readBcdByte(arr, 0x4d)}/${readBcdByte(arr, 0x4e)}/${readBcdByte(arr, 0x4f)}</div>`
}, false);

