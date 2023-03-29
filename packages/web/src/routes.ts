import Home from './routes/Home.svelte';
import Manual from './routes/Manual.svelte';
import Author from './routes/Author.svelte';
import NotFound from './routes/NotFound.svelte';

export default {
    '/': Home,
    '/manual': Manual,
    '/author': Author,
    // The catch-all route must always be last
    '*': NotFound
};