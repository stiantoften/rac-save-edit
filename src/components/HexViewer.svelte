<script>
    export let data;
</script>

<div>
    {[...new Uint8Array(data)]
        .map((c, i) => {
            let hexByte = "";
            if (i == 0) {
                hexByte += `${i.toString(16).padStart(5, "0")}  `;
            }
            if (c) {
                hexByte += c.toString(16).padStart(2, "0");
            } else {
                hexByte += "00";
            }
            hexByte += " ";
            if ((i + 1) % 0x10 === 0) {
                hexByte += `\n${(i + 1).toString(16).padStart(5, "0")}  `;
            } else if ((i + 1) % 0x08 === 0) {
                hexByte += " ";
            }
            return hexByte;
        })
        .join("")}
    {@html "<br>"}
</div>

<style>
    div {
        border: 1px solid black;
        border-radius: 4px;
        padding: 10px;
        resize: vertical;
        white-space: pre;
        font-family: monospace;
        overflow-y: auto;
        height: 400px;
        text-align: left;
    }
    ::-webkit-scrollbar {
        width: 10px;
    }
    ::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover {
        background: #555;
    }
</style>
