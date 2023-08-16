<script context="module" type="ts">
    import { TIME_SECOND } from "../../constants";
    import { onMount, createEventDispatcher } from "svelte";

    // eslint-disable-next-line no-undef
    export type TimerInterval = NodeJS.Timeout;
    export type TimerDuration = number;
    export type TimerCount = number;
    export type TimerTime = string;
    export type TimerResponseDone = number;
    export type TimerEventDone = CustomEvent<TimerResponseDone>;
    export type TimerEvents = { done: TimerResponseDone };

    export const TIMER_COUNT_INCREMENT = 1;
    export const TIMER_INIT_COUNT = 0;
</script>

<script type="ts">
    const dispatch = createEventDispatcher<TimerEvents>();

    export let duration: TimerDuration;

    let remaining: TimerDuration;
    let interval: TimerInterval;
    let count: TimerCount;

    handleReset();

    onMount(() => {
        interval = setInterval(handleTimer, TIME_SECOND);
    });

    $: time = new Date(remaining).toISOString().slice(14, 19);

    function handleTimer() {
        remaining -= TIME_SECOND;
        if (!remaining) {
            remaining = duration;
            count += TIMER_COUNT_INCREMENT;
        }
    }

    function handleReset() {
        remaining = duration;
        count = TIMER_INIT_COUNT;
        clearInterval(interval);
    }

    function handleDone() {
        dispatch("done", count);
    }
</script>

<section>
    <time>{time}</time>
    <aside>
        <h2>
            <span>Times:</span>
            <code>{count}</code>
        </h2>
        <button on:click={handleDone}>Done</button>
    </aside>
</section>

<style type="scss">
    @use "../../styles/color";
    section {
        display: inline-block;
        margin: auto;
        text-align: center;

        time {
            color: color.$main;
            font-size: 4em;
            font-weight: 100;
        }

        aside {
            display: flex;
            align-items: center;
            justify-content: space-between;

            h2 {
                font-size: 1.2em;
                span {
                    opacity: 0.6;
                }
            }

            button {
                background: #ccc;
                border-radius: 0.33em;
                padding: 0.5em;
                text-transform: uppercase;
            }
        }
    }
</style>
