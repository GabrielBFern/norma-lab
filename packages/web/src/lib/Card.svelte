<script>
  import { createEventDispatcher } from "svelte";

  export let card;

  const dispatch = createEventDispatcher();
  let error = null;

  function validate() {
    const value = card.value.trim();
    error = !/^[1-9]\d*$/.test(value);
  }

  validate();
</script>

<div class="card">
  <span>Registrador</span>
  <input type="text" bind:value={card.name} />
  <div class="value">
    <span>Valor</span>
    <input type="text" bind:value={card.value} on:input={validate} />
    {#if error}
      <p class="error">Value must be a positive integer</p>
    {/if}
  </div>
  <button
    on:click={() => {
      dispatch("remove");
    }}>Remove</button
  >
</div>

<style>
  .card {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: white;
    padding: 16px;
    border-radius: 8px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    margin-bottom: 16px;
  }

  .card input {
    margin-bottom: 8px;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 100%;
  }

  .card .error {
    color: red;
    font-size: 14px;
    margin-top: 4px;
  }
</style>
