<script context="module" type="ts">
    import Root from "../../containers/Root.svelte";
    import Form from "./_Form.svelte";
    import Timer from "./_Timer.svelte";
    import { TIME_POMODORO } from "../../constants";
    import type { TimerEventDone, TimerResponseDone } from "./_Timer.svelte";
    import type { FormEventReady, FormResponseReady } from "./_Form.svelte";

    export type HomeVisible = boolean;
    export type HomeSubject = FormResponseReady;
    export type HomeTasks = { subject: HomeSubject; count: TimerResponseDone }[];

    export const HOME_INIT_VISIBLE: HomeVisible = false;
    export const HOME_INIT_SUBJECT: HomeSubject = "";
</script>

<script type="ts">
    let visible: HomeVisible = HOME_INIT_VISIBLE;
    let subject: HomeSubject = HOME_INIT_SUBJECT;
    let tasks: HomeTasks = [];

    function handleReady(ev: FormEventReady) {
        const { detail } = ev;
        subject = detail;
    }

    function handleDone(ev: TimerEventDone) {
        const { detail } = ev;
        tasks = [...tasks, { subject, count: detail }];
        subject = HOME_INIT_SUBJECT;
    }

    function handleVisible() {
        visible = !visible;
    }
</script>

<Root>
    {#if !subject}
        <section>
            <Form on:ready={handleReady} class={tasks.length && "flat"} />
            {#if tasks.length}
                <button on:click={handleVisible}>{visible ? "Hide" : "Log"}</button>
            {/if}
            {#if visible}
                <ul>
                    {#each tasks as { subject, count }}
                        <li>
                            <strong>{subject}</strong>
                            <code>{count}</code>
                        </li>
                    {/each}
                </ul>
            {/if}
        </section>
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

    section {
        display: inline-block;
        margin: auto;

        button {
            background-color: #ddd;
            padding: 0.5em 1em;
            border-bottom-left-radius: 0.33em;
            border-bottom-right-radius: 0.33em;
        }

        ul {
            margin-top: 1.5em;
            font-size: 1.2em;
        }
    }
</style>
