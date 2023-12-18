<script>
    export let gameData;
    export let save;
    export let selected = 0;

    const handleTabClick = (i) => {
        selected = i;
    };

    const h = (input) => Number.parseInt(input);
</script>

{#if gameData && save}
    <div class="outer">
        <div class="tabbar">
            {#each gameData.categories as category, i (i)}
                <button class="tab" on:click={() => handleTabClick(i)}>
                    {category.name}
                </button>
            {/each}
        </div>

        <div class="tab-content">
            {#each gameData.values.filter((v) => v.category === gameData.categories[selected].name) as value}
                {#if value.type === "bool"}
                    <label>
                        <input type="checkbox" />
                        {value.name}
                    </label>
                {:else if value.type === "uint32"}
                    <label>
                        <input
                            type="number"
                            bind:value={save[h(value.position)]}
                        />
                        {value.name}
                    </label>
                {/if}
            {/each}
        </div>
    </div>
{/if}

<style>
    .outer {
        border-radius: 0 0 20px 20px;
        width: 800px;
    }
    .tabbar {
        display: flex;
    }
    .tab-content {
        border: 1px solid black;
        padding: 10px;
        display: flex;
        flex-direction: column;
        align-items: start;
    }
    .tab {
        border: none;
        background: none;
        border: 1px solid black;
        margin-right: -1px;
        border-radius: 8px 8px 0 0;
        border-bottom: none;
        padding: 4px 20px;
        cursor: default;
    }
</style>
