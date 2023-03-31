<script lang="ts">
  import Card from "./Card.svelte";
  export let updateCards = (new_cards) => (registers = new_cards);

  export let registers = [];
  export let modeInput: boolean = false;

  function addCard() {
    let newCard = { title: "", value: "0" };
    registers = [...registers, newCard];
    updateCards(registers);
  }

  function removeCard(index) {
    registers.splice(index, 1);
    registers = [...registers];
    updateCards(registers);
  }
</script>

<div class="grid">
  {#each registers as card, index}
    <Card {card} on:remove={() => removeCard(index)} {modeInput} />
  {/each}
  {#if modeInput}
    <div class="card add-card">
      <button on:click={addCard}>+</button>
    </div>
  {/if}
</div>

<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    grid-gap: 10px;
    margin-top: 20px;
  }

  .add-card {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: 2px dashed #ccc;
    padding: 10px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .add-card:hover {
    border-color: #666;
  }

  .card button {
    font-size: 5rem;
    font-weight: 100;
    width: 100%;
    height: 100%;
    text-decoration: none;
  }
</style>
