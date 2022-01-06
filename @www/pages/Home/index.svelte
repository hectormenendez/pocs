
<script type="ts">
    import Root from "../../containers/Root.svelte";
    import Form from "./_Form.svelte";
    import type { FormEventReady, FormResponseReady } from "./_Form.svelte";

    let subject: FormResponseReady;

    function handleReady(ev: FormEventReady) {
        const { detail } = ev;
        subject = detail;
    }
</script>

<Root>
    {#if !subject}
        <Form on:ready={handleReady} />
    {:else}
        <h1>{subject}</h1>
    {/if}
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
