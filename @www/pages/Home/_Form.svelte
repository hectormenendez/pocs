<script context="module" type="ts">
    export type FormSubject = string | undefined;
    export type FormError = Error | undefined;
    export type FormResponseReady = NonNullable<FormSubject>;
    export type FormEventReady = CustomEvent<FormResponseReady>;
    export type FormEvents = {
        ready: FormResponseReady
    }
    export const FORM_INIT_ERROR: FormError = undefined;
    export const FORM_INIT_SUBJECT: FormSubject = "";
</script>

<script type="ts">
    import { createEventDispatcher } from "svelte"
    import type { FormEvent } from "../../types";

    const dispatch = createEventDispatcher<FormEvents>();

    let error: FormError;
    let subject: FormSubject;

    handleReset();

    $: isSubmitReady = Boolean(subject && subject.length > 0);

    function handleReset() {
        error = FORM_INIT_ERROR;
        subject = FORM_INIT_SUBJECT;
    }

    export function handleSubmit(ev: FormEvent) {
        ev.preventDefault(); // a filter can be used, but I rather be manual for now.
        subject = String(subject).trim();
        if (!subject) {
            error = new Error("Expecting a value.");
            handleReset();
            return;
        }
        dispatch("ready", subject);
        handleReset();
    }
</script>

<form on:submit={handleSubmit} autocomplete="off">
    <label for="desc">What are you going to do?</label>
    <input type="text" name="desc" bind:value={subject} />
    <button type="submit" disabled={!isSubmitReady}>Start</button>
    {#if error}
        <code>{error.message}</code>
    {/if}
</form>


<style type="scss">
    form {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            padding: 1em;
            border-radius: 0.33em;
            background-color: #eee;
            max-width: 640px;
            min-width: 320px;
            margin: auto;

            label {
                flex-grow: 9;
                min-width: 100%;
            }

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
