
const /** @type {HTMLInputElement} */ saveInput = document.getElementById('save-input')
const editorArea = document.getElementById('editor');

let gameDb = [];
fetch('./games/db.json').then((res) =>
    res.json()
).then((res) => {
    gameDb = res;
});

let gameList = [];

// https://stackoverflow.com/questions/40031688/javascript-arraybuffer-to-hex
const buf2hex = (buffer) => [... new Uint8Array(buffer)].map(x => x.toString(16).padStart(2, '0')).join(' ');

const readFile = (file) => new Promise((resolve, reject) => {
    var reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = (e) => {
        resolve(e.target.result);
    }
});

const onChangeGame = (e) => {
    deleteDataArea();
    deployDataArea(gameList[e.target.value].content.find(c => c.name === "save0.bin").content)
}

const deployDataArea = (savearr) => {
    const dataArea = document.createElement('div');
    dataArea.id = 'dataArea'
    {
        const hexDisplay = document.createElement('div')
        hexDisplay.className = 'hex'
        hexDisplay.innerHTML = buf2hex(savearr);

        const boltCount = document.createElement('div')
        boltCount.innerHTML = `Bolt count: ${savearr[0x24]}`

        const date = document.createElement('div');
        date.innerHTML = `Date: ${readBcdByte(savearr, 0x4d)}/${readBcdByte(savearr, 0x4e)}/${readBcdByte(savearr, 0x4f)}`

        dataArea.appendChild(document.createElement('br'))
        dataArea.appendChild(hexDisplay)
        dataArea.appendChild(document.createElement('br'))
        dataArea.appendChild(boltCount)
        dataArea.appendChild(document.createElement('br'))
        dataArea.appendChild(date)
    }
    editor.appendChild(dataArea)
}

const deleteDataArea = () => {
    const dataArea = document.getElementById('dataArea');
    if (dataArea) {
        dataArea.remove();
    }
}

const deployGameSelector = (content) => {
    const gameSelector = document.createElement('select')
    gameSelector.id = 'gameSelector'
    gameSelector.addEventListener('change', onChangeGame)

    gameList = [];
    content.forEach(c => {
        const dbGame = gameDb.find(g => g.codes.includes(c.name))

        if (dbGame) {
            const newGame = { ...c, friendlyName: dbGame.name }

            const gameOption = document.createElement('option')
            gameOption.value = gameList.length
            gameOption.innerHTML = newGame.friendlyName;
            gameSelector.appendChild(gameOption)

            gameList.push(newGame)
        }
    })

    editor.appendChild(gameSelector)
}

const deleteGameSelector = () => {
    const gameSelector = document.getElementById('gameSelector');
    if (gameSelector) {
        gameSelector.remove();
    }
}

saveInput.addEventListener('change', async () => {
    const file = saveInput.files[0]
    if (!file) return;

    const ab = await readFile(file);
    const arr = new Uint8Array(ab);

    let savearr = arr;

    deleteGameSelector();
    if (file.name.endsWith('.ps2')) {
        const content = readPs2(arr);
        const save0 = content.content[2].content.find(c => c.name === "save0.bin");
        savearr = save0.content;

        deployGameSelector(content.content)
    }

    deleteDataArea();
    deployDataArea(savearr);
}, false);

