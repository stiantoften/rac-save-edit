<script>
    export let file;

    const handleDrop = (e) => {
        if (!e.dataTransfer.files) return;
        file = e.dataTransfer.files[0];
    };
</script>

<div
    class="dropzone"
    role="document"
    on:drop|preventDefault={handleDrop}
    on:dragover|preventDefault
>
    <div class="title">Drop savefile here</div>
    <div>Supported formats: .ps2 .bin</div>
</div>

<style>
    .title {
        font-size: 20px;
    }
    .dropzone {
        width: 400px;
        height: 200px;
        border: 1px dashed black;
        border-radius: 14px;
        border-width: 2px;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
</style>
