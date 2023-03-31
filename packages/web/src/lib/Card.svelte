<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let card;
  export let modeInput: boolean = false;

  const dispatch = createEventDispatcher();
  let errorTitle = null;
  let errorValue = null;

  function validateValue() {
    const value = card.value.trim();
    if (!/^[0-9]\d*$/.test(value)) {
      errorValue = "Valor deve ser um número natural";
    } else {
      errorValue = null;
    }
  }

  function validateTitle() {
    const value = card.title.trim();
    if (value.length == 0) {
      errorTitle = "Informe o nome do registrador";
      return;
    }
    if (!/^[a-zA-Z_][a-zA-Z_0-9]*\d*$/.test(value)) {
      errorTitle = "Nome inválido para o registrador";
    } else {
      errorTitle = null;
    }
  }
  validateValue;
  validateTitle();
</script>

<div class="card">
  <span>Registrador</span>
  <input
    class="title-input"
    type="text"
    bind:value={card.title}
    on:input={validateTitle}
    disabled={!modeInput}
  />
  {#if errorTitle}
    <p class="error">{errorTitle}</p>
  {/if}
  <span>Valor</span>
  <input
    class="value-input"
    type="text"
    bind:value={card.value}
    on:input={validateValue}
    disabled={!modeInput}
  />
  {#if errorValue}
    <p class="error">{errorValue}</p>
  {/if}
  {#if modeInput}
    <button
      on:click={() => {
        dispatch("remove");
      }}>X</button
    >
  {/if}
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
    position: relative;
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

  .card button {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 12px;
    background-color: #fff;
    border: 1px dashed #ccc;
    color: #ccc;
    height: 25px;
    width: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px;
    cursor: pointer;
    border-radius: 100%;
  }

  .title-input {
    text-align: center;
  }

  .value-input {
    text-align: right;
  }
</style>
