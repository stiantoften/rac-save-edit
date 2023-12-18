<script>
    export let gameDB;
    export let mc;
    export let selected;
</script>

{#if mc}
    <select bind:value={selected}>
        {#each mc.content.filter( (c) => gameDB.some( (g) => g.codes.includes(c.name), ), ) as game}
            <option value={game}
                >{gameDB.find((g) => g.codes.includes(game.name)).name}</option
            >
        {/each}
    </select>
{/if}
