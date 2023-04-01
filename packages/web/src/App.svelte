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
    margin: 0 auto;
  }

  h1 {
    text-align: center;
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4rem;
    font-weight: 100;
    margin: auto;
  }

  a {
    color: inherit; /* blue colors for links too */
    text-decoration: inherit; /* no underline */
  }

  :global(body) {
    padding: 0;
  }

  @media screen and (max-width: 900px) {
    h1 {
      font-size: 2rem;
    }
  }
</style>
