<script lang="ts">
  import { link } from "svelte-spa-router";
  import Router from "svelte-spa-router";
  import routes from "./routes";
</script>

<main>
  <h1><a href="/" use:link>NormaLab</a></h1>
  <Router {routes} />
</main>

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
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

  a {
    color: inherit; /* blue colors for links too */
    text-decoration: inherit; /* no underline */
  }

  :global(body) {
    padding: 0;
  }
</style>
