<script>
  import gameDB from "./assets/db.json";
  import { readPs2 } from "./lib/ps2-reader";
  import { readBcdByte } from "./lib/buffer-reader";

  import Dropzone from "./components/Dropzone.svelte";
  import GameSelector from "./components/GameSelector.svelte";
  import SaveSelector from "./components/SaveSelector.svelte";
  import HexViewer from "./components/HexViewer.svelte";
  import ResetButton from "./components/ResetButton.svelte";
  import TabSystem from "./components/TabSystem.svelte";

  let file;
  let mc;
  let save;

  let boltCount;
  let date;

  let selectedGame;
  let selectedSave;

  let gameData;

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

  const handleGameChange = async (game) => {
    const dbGame = gameDB.find((g) => g.codes.includes(game.name));
    if (!dbGame) return;

    const fetchedGame = await fetch(`rac-save-edit/${dbGame.file}`);
    gameData = await fetchedGame.json();
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

  $: if (selectedGame) {
    handleGameChange(selectedGame);
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
  {/if}

  <TabSystem {gameData} bind:save />
</div>

<style>
  div {
    margin: 0 auto;
    max-width: 800px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
</style>
