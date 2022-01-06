<script context="module" type="ts">
    import type { FormResponseReady } from "./_Form.svelte";
    export type HomeSubject = FormResponseReady;

    export const HOME_INIT_SUBJECT: HomeSubject = "";
</script>

<script type="ts">
    import Root from "../../containers/Root.svelte";
    import Form from "./_Form.svelte";
    import Timer from "./_Timer.svelte";
    import { TIME_POMODORO } from "../../constants";
    // import type { TimerEventDone } from "./_Timer.svelte";
    import type { FormEventReady } from "./_Form.svelte";

    let subject: HomeSubject = HOME_INIT_SUBJECT;

    function handleReady(ev: FormEventReady) {
        const { detail } = ev;
        subject = detail;
    }

    function handleDone() {
        subject = HOME_INIT_SUBJECT;
    }

</script>

<Root>
    {#if !subject}
        <Form on:ready={handleReady} />
    {:else}
        <h1>{subject}</h1>
        <Timer duration={TIME_POMODORO} on:done={handleDone} />
    {/if}
</Root>

<style type="scss">
    h1 {
        display: inline-block;
        margin: auto;
        text-align: center;
        max-width: 50%;
        font-size: 1.5em;
    }
</style>
