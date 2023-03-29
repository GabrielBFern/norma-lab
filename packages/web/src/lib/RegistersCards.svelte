<script>
  import Card from "./Card.svelte";
  export let updateCards = (new_cards) => (registers = new_cards);

  export let registers = [];
  let newCard = { name: "", value: "" };

  function addCard() {
    registers = [...registers, newCard];
    newCard = { name: "", value: "" };
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
    <Card {card} on:remove={() => removeCard(index)} />
  {/each}
  <div class="card add-card">
    <button on:click={addCard}>+</button>
  </div>
</div>
