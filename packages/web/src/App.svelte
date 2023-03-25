<script lang="ts">
    import NormaFrame from "./lib/NormaCodeFrame.svelte";
</script>

<main>
    <h1>NormaLab</h1>
    <div class="Frame">
        <NormaFrame />
    </div>
</main>

<style>
    :root {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
    }

    main {
        padding: 1em;
        margin: 0 auto;
    }

    h1 {
        text-align: center;
        color: #ff3e00;
        text-transform: uppercase;
        font-size: 4rem;
        font-weight: 100;
        line-height: 1.1;
        margin: 2rem auto;
        max-width: 14rem;
    }

    @media (min-width: 480px) {
        h1 {
            max-width: none;
        }
    }
    :global(body) {
        padding: 0;
    }
</style>
