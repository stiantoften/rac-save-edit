<script>
    export let save;
    export let offset;
    export let label;
    let checked = save[offset];

    $: save[offset] = checked ? 1 : 0;
</script>

<label>
    <input type="checkbox" bind:checked />
    {label}
</label>
