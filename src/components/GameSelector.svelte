<script>
    export let gameDB;
    export let mc;
    export let value;
</script>

{#if mc}
    <select bind:value>
        {#each mc.content.filter( (c) => gameDB.some( (g) => g.codes.includes(c.name), ), ) as game}
            <option value={game}
                >{gameDB.find((g) => g.codes.includes(game.name)).name}</option
            >
        {/each}
    </select>
{/if}

<style>
    select {
        padding: 10px;
        border-radius: 4px;
    }
</style>
