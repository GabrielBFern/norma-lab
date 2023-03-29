<script>
    export let sidebar = false;
</script>

<header
    class="flex justify-between bg-gray-200 p-2 items-center text-gray-600 border-b-2"
>
    <nav class="flex">
        <button
            class="text-gray-500 hover:text-gray-700 cursor-pointer mr-4 border-none focus:outline-none"
            on:click={() => (sidebar = !sidebar)}
        />
    </nav>
</header>
