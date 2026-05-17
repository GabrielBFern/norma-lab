import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
    base: "/",
    plugins: [svelte()],
    resolve: {
        dedupe: [
            '@codemirror/state',
            '@codemirror/view',
            '@codemirror/language',
            '@codemirror/lint',
            '@codemirror/commands',
            '@codemirror/autocomplete',
            'svelte',
        ]
    }
})