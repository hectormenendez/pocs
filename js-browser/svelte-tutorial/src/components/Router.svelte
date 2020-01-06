<script>
    import { onDestroy } from 'svelte';
    import { Route } from '../store';

    // declare routes prop and set its default to an empty array
    export let routes = [];
    // subscribe to the Route store, fetching the current using it.
    let page;
    const unsubscribe = Route.subscribe(value => {
        page = routes.find(({ path }) => path === value).page;
    })
    onDestroy(unsubscribe);
</script>

<!-- This would render the page once/when/if it's available. -->
<svelte:component this={page} />