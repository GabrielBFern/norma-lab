<script lang="ts">
  import type { NormaInstance, WrappedNormaMachine } from "norma-lab-wasm";
  import { slide } from "svelte/transition";
  import RegistersCards from "./RegistersCards.svelte";
  import "@fortawesome/fontawesome-free/css/all.css";

  export let editor;
  export let normaInstance: NormaInstance;
  export let slim = false;

  let normaMachine: WrappedNormaMachine;
  let collapse_input = false;
  let input_registers2 = [];

  const change_register = (register: string, value: BigInt) => {
    status.register = [
      ...status.register.filter((e) => e.title !== register),
      { title: register, value: value.toString() },
    ];
  };
  const change_line = (line: number) => {
    editor.currentDebugLine(line);
  };

  class Status {
    isRunning: boolean;
    isDebug: boolean;
    line: number;
    register: { title: string; value: string }[];
    isAutoRun: boolean;

    constructor() {
      this.isRunning = false;
      this.isDebug = false;
      this.isAutoRun = false;
      this.register = [];
      this.line = 1;
    }
  }

  let verifyAndChangeCode = () => {
    let result = normaInstance.change_source(editor.getValue());
    if (result !== null) {
      alert("Fonte não está compilando");
    }
    return result !== null;
  };

  let prepareMachine = () => {
    if (input_registers2.length !== 0) {
      let reg_json_safe = [];
      input_registers2.forEach(({ title, value }) => {
        reg_json_safe.push({ name: title, value: value });
      });
      let regs = JSON.stringify(reg_json_safe);
      normaMachine = normaInstance.prepareMachinefromContext(regs);
    } else {
      normaMachine = normaInstance.prepareMachine();
    }
  };

  let updateInputReg = (newRegs) => {
    input_registers2 = newRegs;
  };

  function keepRun() {
    if (!status.isRunning) {
      editor.readOnlyMode(false);
      return;
    }
    let endProgram = normaMachine.runBound(100000, change_register);
    if (endProgram) {
      window.requestAnimationFrame(keepRun);
    }
  }

  let status = new Status();
  const play = () => {
    if (verifyAndChangeCode()) return;
    prepareMachine();
    editor.readOnlyMode(true);
    window.requestAnimationFrame(keepRun);
    status.isRunning = true;
  };
  const debug = () => {
    if (verifyAndChangeCode()) return;
    prepareMachine();
    change_line(0);
    editor.readOnlyMode(true);
    status.isRunning = true;
    status.isDebug = true;
  };

  const reset = () => {
    editor.clearExecution();
    status = new Status();
  };
  const next = () => {
    normaMachine.nextDebug(change_register, change_line);
  };

  const ative_auto_next = () => {
    status.isAutoRun = true;
  };

  const automatic_next = () => {
    if (status.isAutoRun) {
      next();
    }
  };
  const collapseInput = () => {
    collapse_input = !collapse_input;
  };
  setInterval(automatic_next, 1000);
</script>

<div class="controls">
  <div class="toolbar">
    {#if !status.isRunning}
      <button class="toolbar-button" on:click={play}>
        <i class="fas fa-play header_icon" />
        Executar
      </button>
      <button class="toolbar-button" on:click={debug}>
        <i class="fas fa-bug header_icon" />
        Debugar
      </button>
    {/if}
    {#if status.isRunning}
      <button class="toolbar-button" on:click={reset}>
        <i class="fas fa-redo header_icon" />
        Resetar
      </button>
    {/if}
  </div>
  {#if status.isDebug}
    <div class="toolbar debug-toolbar">
      <button class="toolbar-button" on:click={next}>
        <i class="fas fa-arrow-right header_icon" />
        Seguinte
      </button>
      <button class="toolbar-button" on:click={ative_auto_next}>
        <i class="fas fa-play-circle header_icon" />
        Execução automática
      </button>
    </div>
  {/if}
</div>

{#if !slim}
  <div class="collapse_frame">
    <div class="collapse_header" on:click={collapseInput}>
      <span class="header_text">Registradores de entrada</span>
      {#if collapse_input}
        <i class="fas fa-chevron-right header_icon" />
      {:else}
        <i class="fas fa-chevron-down header_icon" />
      {/if}
    </div>
    {#if !collapse_input}
      <div class="collapse_body" transition:slide>
        <RegistersCards
          registers={input_registers2}
          updateCards={updateInputReg}
          modeInput={true}
        />
      </div>
    {/if}
  </div>
{/if}
<div>
  Registradores Execução
  <RegistersCards registers={status.register} modeInput={false} />
</div>

<style>
  .toolbar-button {
    font-family: inherit;
    font-size: inherit;
    padding: 1em 2em;
    color: #ff3e00;
    background-color: rgba(255, 62, 0, 0.1);
    border-radius: 2em;
    border: 2px solid rgba(255, 62, 0, 0);
    outline: none;
    width: 150px;
    font-variant-numeric: tabular-nums;
    cursor: pointer;
  }

  .toolbar {
    margin-bottom: 8px;
  }

  button:focus.toolbar-button {
    border: 2px solid #ff3e00;
  }

  .collapse_frame {
    border: 1px solid #ccc;
    margin: 10px;
    border-radius: 5px;
  }

  .collapse_header {
    background-color: #eee;
    cursor: pointer;
    padding: 10px;

    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .collapse_body {
    padding: 10px;
  }

  button:active {
    background-color: rgba(255, 62, 0, 0.2);
  }

  .header_text {
    flex-grow: 1;
    text-align: center;
  }

  .header_icon {
    margin-left: auto;
  }
</style>
