<script>
    import { onDestroy } from 'svelte';

    let seconds = 0;

    const interval = setInterval(() => {
        seconds = seconds + 1;
    }, 1000);

    onDestroy(() => {
        clearInterval(interval);
    });
</script>

<page>
    <h1>Home</h1>
    <p>It's been running for {seconds} seconds.</p>
</page>
