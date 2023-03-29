<script lang="ts">
    export let number;
    export let modeInput: Boolean;
    export let name;
    export let onChange;
    let options = [
        {
            id: 0,
            text: `Decimal`,
            adapter: (nb) => {
                return nb;
            },
        },
        {
            id: 1,
            text: `Binário`,
            adapter: (nb) => {
                return nb.toString(2);
            },
        },
        {
            id: 2,
            text: `Octadecimal`,
            adapter: (nb) => {
                return nb.toString(8);
            },
        },
        {
            id: 3,
            text: `Hexadecimal`,
            adapter: (nb) => {
                return nb.toString(16);
            },
        },
        {
            id: 4,
            text: `Vec`,
            adapter: (nb) => {
                return "Falta im";
            },
        },
    ];
    let selected;

    $: onChange(number);
</script>

<div class="card">
    <div class="name">{name}</div>
    <div class="value">
        {options[selected ? selected.id : 0].adapter(BigInt(number))}
    </div>
    {#if modeInput}
        <input type="number" bind:value={number} min="1" />
    {:else}
        <select bind:value={selected}>
            {#each options as opt}
                <option value={opt}>
                    {opt.text}
                </option>
            {/each}
        </select>
    {/if}
</div>

<style>
    .card {
        /* Change background color */
        background-color: white;

        /* Add border */
        border: 1px solid #bacdd8;

        /* Add space between the border and the content */
        padding: 8px;
        margin: 8px;

        border-radius: 12px;
    }
    /* Style div elements that have class equal to name */
    .name {
        font-size: 24px;
        font-weight: 600;

        margin-top: 16px;
    }
    /* Style p element */
    .value {
        font-size: 20px;
        color: #7f8c9b;
        line-height: 150%;
    }
</style>
