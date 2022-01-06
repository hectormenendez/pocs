
<script type="ts">
    import Root from "../../containers/Root.svelte";
    import Form from "./_Form.svelte";

    function handleReady(ev: CustomEvent<string>) {
        console.log("Ready", ev.detail)
    }
</script>

<Root>
    <Form on:ready={handleReady} />
</Root>

<style type="scss">
    /* @use "../../styles/color";
    time {
        display: inline-block;
        margin: auto;
        text-align: center;
        color: color.$main;
        font-size: 4em;
        font-weight: 100;
    } */
</style>
