<script>
  import gameDB from "./assets/db.json";
  import { readPs2 } from "./lib/ps2-reader";
  import { readBcdByte } from "./lib/buffer-reader";

  import Dropzone from "./components/Dropzone.svelte";
  import GameSelector from "./components/GameSelector.svelte";
  import SaveSelector from "./components/SaveSelector.svelte";
  import HexViewer from "./components/HexViewer.svelte";
  import ResetButton from "./components/ResetButton.svelte";

  let file;
  let mc;
  let save;

  let boltCount;
  let date;
  let selectedGame;
  let selectedSave;

  const readFile = (file) =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = (e) => {
        resolve(e.target.result);
      };
    });

  const processFile = async (file) => {
    const buff = await readFile(file);
    const arr = new Uint8Array(buff);

    if (file.name.endsWith(".ps2")) {
      mc = readPs2(arr);
    } else if (file.name.endsWith(".bin")) {
      save = arr;
    }
  };

  $: if (save) {
    boltCount = save[36];
    date =
      readBcdByte(save, 0x4d) +
      "/" +
      readBcdByte(save, 0x4e) +
      "/" +
      readBcdByte(save, 0x4f);
  }

  $: if (file) {
    processFile(file);
  }

  $: if (selectedSave) {
    save = selectedSave.content;
  }

  const handleReset = () => {
    file = null;
    mc = null;
    save = null;
    console.log(file);
  };
</script>

<h1>Rachet & Clank Save Editor</h1>
<div>
  {#if !file}
    <Dropzone bind:file />
  {:else}
    <ResetButton on:click={handleReset} />
    <GameSelector {mc} {gameDB} bind:selected={selectedGame} />
    <SaveSelector game={selectedGame} bind:selected={selectedSave} />

    {#if save}
      <HexViewer data={save} />
    {/if}

    {#if boltCount !== null && boltCount != undefined}
      <div>Bolt count: {boltCount}</div>
    {/if}

    {#if date}
      <div>Date: {date}</div>
    {/if}
  {/if}
</div>

<style>
  div {
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 10px;
  }
</style>
