<script type="ts">
    import Root from "../containers/Root.svelte";
    import { TIME_POMODORO, TIME_SECOND } from "../constants";
    import type { FormEvent } from "../types";

    export let error: Error;
    export let time = TIME_POMODORO;
    export let subject = "";
    export let isReady = false;

    setInterval(handleTimer, TIME_SECOND);

    function handleTimer() {
        time -= TIME_SECOND;
    }

    export function handleSubmit(ev: FormEvent) {
        ev.preventDefault();
        if (!subject) {
            error = new Error("Expecting a value.");
            return;
        }
    }
</script>

<Root>
    {#if !isReady}
        <form on:submit={handleSubmit}>
            <input type="text" name="desc" value={subject} />
            <button type="submit" disabled={!isReady}>Start</button>
        </form>
    {:else}
        <time>{time}</time>
    {/if}
</Root>

<style type="scss">
    @use "../styles/color";
    time {
        display: inline-block;
        margin: auto;
        text-align: center;
        color: color.$main;
        font-size: 4em;
        font-weight: 100;
    }

    form {
        display: flex;
        justify-content: space-between;
        padding: 1em;
        border-radius: 0.33em;
        background-color: #eee;
        max-width: 640px;
        min-width: 320px;
        margin: auto;

        input,
        button {
            display: flex;
            line-height: 1.5em;
            padding: 0.25em 0.5em;
        }

        input {
            flex-grow: 2;
            background-color: #fff;
            border-top-left-radius: 0.33em;
            border-bottom-left-radius: 0.33em;
            border: 1px solid #ccc;
        }

        button {
            align-items: center;
            background-color: #ccc;
            border-top-right-radius: 0.33em;
            border-bottom-right-radius: 0.33em;
            text-transform: uppercase;
            padding-right: 0.6em;

            &:active {
                background-color: #666;
            }

            &:disabled {
                opacity: 0.5;
                border: 1px solid #aaa;
                border-left: 0;
            }
        }
    }
</style>
