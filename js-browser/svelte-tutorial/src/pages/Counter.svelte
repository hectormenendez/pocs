<script>
    let count = 0;
    function handleClick(e) {
        const value = parseInt(e.target.dataset.value, 10);
        count += value
    }
</script>

<h1>My Awesome Svelte app - Page 1</h1>
<span>Counter: {count}</span>
<button type="button" data-value={+1} on:click={handleClick}>Increment</button>
<button type="button" data-value={-1} on:click={handleClick}>Decrement</button>
