<script>
  import { onMount } from "svelte";
  import { readPs2 } from "./lib/ps2-reader";
  import { load as parseYaml } from "js-yaml";

  import Dropzone from "./components/Dropzone.svelte";
  import TabSystem from "./components/TabSystem.svelte";
  import HexViewer from "./components/HexViewer.svelte";
  import ResetButton from "./components/ResetButton.svelte";
  import SaveSelector from "./components/SaveSelector.svelte";
  import GameSelector from "./components/GameSelector.svelte";
  import { readUint16 } from "./lib/buffer-reader";
  import SaveButton from "./components/SaveButton.svelte";

  let gameDB = [];
  onMount(async () => {
    const fetchedDB = await fetch(`${import.meta.env.BASE_URL}/db.yaml`);
    gameDB = parseYaml(await fetchedDB.text());
  });

  let file;
  let mc;
  let save;

  let selectedGame;
  let selectedSave;

  let dbGameData;

  const readFile = (file) =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = (e) => {
        resolve(e.target.result);
      };
    });

  const processFile = async (file) => {
    if (!file) return;
    const buff = await readFile(file);
    const arr = new Uint8Array(buff);

    if (file.name.endsWith(".ps2")) {
      mc = readPs2(arr);
    } else if (file.name.endsWith(".bin")) {
      save = arr;
      const magic = readUint16(arr, 0);
      const dbGame = gameDB.find((g) => g.magic === magic);
      if (!dbGame) return;
      await loadDbGame(dbGame);
    }
  };

  const loadDbGame = async (dbGame) => {
    const fetchedGame = await fetch(
      `${import.meta.env.BASE_URL}/${dbGame.file}`,
    );
    dbGameData = parseYaml(await fetchedGame.text());
  };

  const handleGameChange = async (game) => {
    if (!game) return;
    const dbGame = gameDB.find((g) => g.codes.includes(game.name));
    if (!dbGame) return;
    await loadDbGame(dbGame);
  };

  const handleReset = () => {
    file = null;
    mc = null;
    save = null;
  };

  const handleSave = async () => {
    const handle = await showSaveFilePicker({
      suggestedName: "save0.bin",
      types: [
        {
          description: "Binary file (.bin)",
          accept: { "binary/octet-stream": [".bin"] },
        },
      ],
    });
    const ws = await handle.createWritable();
    await ws.write(save);
    await ws.close();
  };

  $: processFile(file);
  $: handleGameChange(selectedGame);
  $: save = selectedSave?.content;
</script>

<h1>Rachet & Clank Save Editor</h1>
<div class="main">
  {#if !file}
    <Dropzone bind:file />
  {:else}
    <div class="buttonbox">
      <ResetButton on:click={handleReset} />
      <SaveButton on:click={handleSave} />
    </div>
    <GameSelector bind:value={selectedGame} {mc} {gameDB} />
    <SaveSelector bind:value={selectedSave} game={selectedGame} />
    {#if save}
      <HexViewer data={save} />
      <TabSystem {dbGameData} bind:save />
    {/if}
  {/if}
</div>

<style>
  .main {
    margin: 0 auto;
    max-width: 800px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .buttonbox {
    display: flex;
    gap: 10px;
  }
</style>
