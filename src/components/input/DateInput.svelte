<script>
    import { afterUpdate, onMount } from "svelte";

    export let day;
    export let month;
    export let year;
    export let label;
    let value;

    const convertToBcd = (input) => {
        const tens = ~~(input / 16);
        const ones = input % 16;
        return tens * 10 + ones;
    };

    const convertFromBcd = (input) => {
        const tens = ~~(input / 10);
        const ones = input % 10;
        return tens * 16 + ones;
    };

    const fetchValue = () => {
        if (year === 0 || month === 0 || day === 0) {
            // If the savefile has not been used, the date in the savefile is bogus.
            // Here we set the value to something that will not affect the savefile
            // until a new value is picked in the datepicker.
            // Kinda hacky, but only gives a warning in tested browsers.
            value = "2000-00-00";
        } else {
            value =
                "20" +
                convertToBcd(year) +
                "-" +
                String(convertToBcd(month)).padStart(2, "0") +
                "-" +
                String(convertToBcd(day)).padStart(2, "0");
        }
    };

    $: if (value) {
        const fmt = value.split("-");
        year = convertFromBcd(parseInt(fmt[0] - 2000));
        month = convertFromBcd(parseInt(fmt[1]));
        day = convertFromBcd(parseInt(fmt[2]));
    }

    onMount(fetchValue);
    afterUpdate(fetchValue);
</script>

<label>
    <input type="date" bind:value min="2000-01-01" max="2099-01-01" />
    {label}
</label>
