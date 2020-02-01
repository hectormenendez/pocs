<script lang="ts">
    let message: [string] = ["Hello World"];
    message = message.map(m => m.concat("!"))
</script>

<main>
    <h1>{message}</h1>
</main>

<style>
    main {
        display: flex;
        background: chocolate;
    }

    h1 {
        background: deeppink;
        color: limegreen;
    }
</style>
