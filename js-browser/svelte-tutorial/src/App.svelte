<script>
    import Router from './components/Router.svelte';
    import Link from './components/Link.svelte';

    import Home from './pages/Home.svelte';
    import Speech from './pages/Speech.svelte';
    import Counter from './pages/Counter.svelte';

    const routes = [
        { path: '/', title: 'Home', page: Home },
        { path: '/counter', title: 'Counter', page: Counter },
        { path: '/speech', title: 'Speech', page: Speech },
    ];
</script>

<style>
    nav {
        display: flex;
        justify-content: space-between;
    }
    nav :global(a) {
        display: block;
    }
</style>

<main>
    <nav>
        {#each routes as { path, title }}
            <Link {path} {title} />
        {/each}
    </nav>
    <!-- The dinamically loaded component will be placed here -->
    <Router {routes} />
</main>
