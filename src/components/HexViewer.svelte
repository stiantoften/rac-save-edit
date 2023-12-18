<script>
    export let data;
</script>

<div>
    {[...data]
        .map((c, i) => {
            let hexByte = c.toString(16).padStart(2, "0");
            if ((i + 1) % 0x10 === 0) hexByte += "\n";
            return hexByte;
        })
        .join(" ")}
    {@html "<br>"}
</div>

<style>
    div {
        padding: 10px;
        resize: vertical;
        white-space: pre-line;
        font-family: monospace;
        overflow-y: auto;
        height: 400px;
        text-align: left;
    }
</style>
