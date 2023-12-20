<script>
    import BoolInput from "./input/BoolInput.svelte";
    import DateInput from "./input/DateInput.svelte";
    import NumberInput from "./input/NumberInput.svelte";

    export let gameData;
    export let save;
    export let selected = 0;
</script>

{#if gameData && save}
    <div class="outer">
        <div class="tabbar">
            {#each gameData.categories as category, i (i)}
                <button
                    class="tab"
                    class:selected={selected == i}
                    on:click={() => (selected = i)}
                >
                    {category.name}
                </button>
            {/each}
        </div>

        <div class="tab-content">
            {#each gameData.values.filter((v) => v.category === gameData.categories[selected].name) as value}
                {#if value.type === "bool"}
                    <BoolInput
                        bind:save
                        offset={value.offset}
                        label={value.name}
                    />
                {:else if value.type === "int32"}
                    <NumberInput
                        bind:save
                        offset={value.offset}
                        label={value.name}
                    />
                {:else if value.type === "date"}
                    <DateInput
                        bind:day={save[value.offset]}
                        bind:month={save[value.offset + 1]}
                        bind:year={save[value.offset + 2]}
                        label={value.name}
                    />
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

    .tab.selected {
        background-color: rgb(233, 233, 233);
    }
</style>
