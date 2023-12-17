
const /** @type {HTMLInputElement} */ saveInput = document.getElementById('save-input')
const editorArea = document.getElementById('editor');

// https://stackoverflow.com/questions/40031688/javascript-arraybuffer-to-hex
const buf2hex = (buffer) => {
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
    const file = saveInput.files[0]
    if (!file) return;

    const ab = await readFile(file);
    const arr = new Uint8Array(ab);

    let savearr = arr;

    if (file.name.endsWith('.ps2')) {
        const content = readPs2(arr);
        console.log(content);
        const save0 = content.rootDir.content.find(c => c.name === "save0.bin");
        savearr = save0.content;
    }

    editor.innerHTML += `<br><div class=hex>${buf2hex(savearr)}</div>`
    editor.innerHTML += `<br><div>Bolt count: ${savearr[0x24]}</div>`
    editor.innerHTML += `<br><div>Date: ${readBcdByte(savearr, 0x4d)}/${readBcdByte(savearr, 0x4e)}/${readBcdByte(savearr, 0x4f)}</div>`
}, false);

