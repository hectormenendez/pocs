<script>
    import { Route } from '../store';

    export let path;
    export let title;

    function handleClick(e) {
        Route.set(path);
        window.history.pushState({ path }, '', window.location.origin + path);
        e.preventDefault();
        return false;
    }
</script>

<a href={path} on:click={handleClick}>{title}</a>