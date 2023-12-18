<script>
    export let game;
    export let selected;
</script>

{#if game}
    <select bind:value={selected}>
        {#each game.content.filter((c) => c.name.includes("save")) as save}
            <option value={save}>{save.name}</option>
        {/each}
    </select>
{/if}
