<script>
    export let save;
    export let offset;
    export let label;

    let value = save[offset];

    $: save[offset] = value & 0xff;
    $: save[offset + 1] = (value >> 8) & 0xff;
    $: save[offset + 2] = (value >> 16) & 0xff;
    $: save[offset + 3] = (value >> 24) & 0xff;
</script>

<label>
    <input type="number" bind:value max="2147483647" min="-2147483648" />
    {label}
</label>
