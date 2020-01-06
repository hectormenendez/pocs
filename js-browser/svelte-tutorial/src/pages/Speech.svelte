<script>
    let enabled = !!window.speechSynthesis;
    let value = 'This is a test';

    function handleSpeak(e) {
        const utterance = new SpeechSynthesisUtterance(value);
        window.speechSynthesis.speak(utterance);
    }
</script>

<h1>My Awesome Svelte App- Page 2</h1>
{#if !enabled}
    <span>Speech synthesis is not enabled on your browser</span>
{:else}
    <textarea rows="3" bind:value={value} />
    <button type="button" on:click={handleSpeak}>Speak To Me!</button>
{/if}
