<script>
    import { convertFromBcd, convertToBcd } from "../../lib/buffer-reader";

    export let day;
    export let month;
    export let year;
    export let label;

    let value =
        "20" +
        convertToBcd(year) +
        "-" +
        String(convertToBcd(month)).padStart(2, "0") +
        "-" +
        String(convertToBcd(day)).padStart(2, "0");

    $: if (value) {
        const fmt = value.split("-");
        year = convertFromBcd(parseInt(fmt[0] - 2000));
        month = convertFromBcd(parseInt(fmt[1]));
        day = convertFromBcd(parseInt(fmt[2]));
    }
</script>

<label>
    <input type="date" bind:value min="2000-01-01" max="2099-01-01" />
    {label}
</label>
