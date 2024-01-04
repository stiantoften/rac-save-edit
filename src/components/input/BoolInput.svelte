<script>
    import { afterUpdate } from "svelte";

    export let save;
    export let offset;
    export let label;

    let checked = save[offset];

    $: save[offset] = checked ? 1 : 0;

    afterUpdate(() => {
        checked = save[offset];
    });
</script>

<label>
    <input type="checkbox" bind:checked />
    {label}
</label>
