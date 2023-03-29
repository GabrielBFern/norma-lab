<script lang="ts">
    import Register from "./Register.svelte";

    export let registers: Map<String, BigInt>;
    export let modeInput: Boolean;
</script>

{#each [...registers] as [key, value]}
    <div class="card-holder">
        <Register
            number={value}
            name={key}
            {modeInput}
            onChange={(value) => registers.set(key, BigInt(value))}
        />
    </div>
{/each}

<style>
    .card-holder {
        margin: 8px;
    }
</style>
