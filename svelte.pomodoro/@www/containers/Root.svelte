<script type="ts">
    import { onMount } from "svelte";

    export let title = "";

    onMount(handleMount);

    function handleMount() {
        document.title = title;
    }
</script>

<main>
    <slot />
</main>

<style lang="scss">
    :global(html),
    :global(body) {
        height: 100%;
    }

    main {
        display: flex;
        flex-direction: row;
        height: inherit;
    }
</style>
