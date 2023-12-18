<script>
  import Dropzone from "./components/Dropzone.svelte";
  import { readBcdByte } from "./lib/buffer-reader";
  import { readPs2 } from "./lib/ps2-reader";

  let file;
  let boltCount = 0;
  let date;

  const readFile = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = (e) => {
        resolve(e.target.result);
      };
    });

  const processFile = async (file) => {
    const buff = await readFile(file);
    const arr = new Uint8Array(buff);

    let save;
    if (file.name.endsWith(".ps2")) {
      const mc = readPs2(arr);
      const save0 = mc.content
        .find((c) => c.name === "BASCUS-97199RATCHET")
        .content.find((c) => c.name === "save0.bin").content;

      save = save0;
    } else if (file.name.endsWith(".bin")) {
      save = arr;
    }

    boltCount = save[36];
    date =
      readBcdByte(save, 0x4d) +
      "/" +
      readBcdByte(save, 0x4e) +
      "/" +
      readBcdByte(save, 0x4f);
  };

  $: if (file) {
    processFile(file);
  }
</script>

<h1>Rachet & Clank Save Editor</h1>
<div>
  <Dropzone bind:file />
  <br />
  {#if boltCount}
    <div>Bolt count: {boltCount}</div>
  {/if}
  {#if date}
    <div>Date: {date}</div>
  {/if}
</div>

<style>
  div {
    display: flex;
    align-items: center;
    flex-direction: column;
  }
</style>
