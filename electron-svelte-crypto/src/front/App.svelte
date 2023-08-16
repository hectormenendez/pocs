<script lang="typescript">
    const messages: Array<string> = ["hola", "mundo"];
    const message: string = messages.map((msg) => `${msg[0].toUpperCase()}${msg.substring(1)}`).join(" ");
</script>

<main>
    <h1>{message}!</h1>
</main>

<style lang="scss">
    main {
        display: flex;
        background: chocolate;
        h1 {
            background: deeppink;
            color: limegreen;
        }
    }
</style>