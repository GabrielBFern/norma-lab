<script lang="ts">
  import type { NormaInstance, WrappedNormaMachine } from "norma-site-wasm";
  import RegistersHold from "./RegistersHold.svelte";
  import { slide } from "svelte/transition";
  import RegistersCards from "./RegistersCards.svelte";

  export let editor;
  export let normaInstance: NormaInstance;
  export let slim = false;

  let normaMachine: WrappedNormaMachine;
  let collapse_input = false;
  let input_registers: Map<String, BigInt> = new Map();
  let input_registers2 = [];
  let phantom_changes = 0;

  const change_register = (register: String, value: BigInt) => {
    status.register.set(register, value);
    phantom_changes += 1;
    if (phantom_changes % 100 === 0) {
      console.log(status.register);
      console.log(phantom_changes);
      console.log("last redraw:" + redraw);
    }
    // Activate svelte reactivity
    status.register = status.register;
  };
  const change_line = (line: number) => {
    editor.currentDebugLine(line);
  };

  class Status {
    isRunning: boolean;
    isDebug: boolean;
    line: number;
    register: Map<String, BigInt>;
    isAutoRun: boolean;

    constructor() {
      this.isRunning = false;
      this.isDebug = false;
      this.isAutoRun = false;
      this.register = new Map();
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
    if (input_registers.size !== 0) {
      let reg_json_safe = [];
      input_registers.forEach((v, k) => {
        reg_json_safe.push({ name: k, value: v.toString(10) });
      });
      let regs = JSON.stringify(reg_json_safe);
      console.log(regs);
      normaMachine = normaInstance.prepareMachinefromContext(regs);
    } else {
      normaMachine = normaInstance.prepareMachine();
    }
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
    status.register;
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
  const handleNewInputRegister = () => {
    let register = prompt("Que registro deseja criar?");
    if (!register) return;
    input_registers.set(register, BigInt(0));
    console.log(input_registers);
    input_registers = new Map(input_registers);
    collapse_input = false;
  };
  setInterval(automatic_next, 1000);
  $: redraw = phantom_changes;
</script>

<div class="controls">
  <div class="toolbar">
    {#if !status.isRunning}
      <button class="toolbar-button" on:click={play}>Run</button>
      <button class="toolbar-button" on:click={debug}>Debug</button>
    {/if}
    {#if status.isRunning}
      <button class="toolbar-button" on:click={reset}>Reset</button>
    {/if}
  </div>
  {#if status.isDebug}
    <div class="toolbar debug-toolbar">
      <button class="toolbar-button" on:click={next}>Next</button>
      <button class="toolbar-button" on:click={ative_auto_next}
        >Auto Next</button
      >
    </div>
  {/if}

  {#if !slim}
    <div class="collapse_frame">
      <div class="collapse_header" on:click={collapseInput}>Input</div>
      {#if !collapse_input}
        <div class="collapse_body" transition:slide>
          <RegistersHold registers={input_registers} modeInput={true} />
          <button on:click={handleNewInputRegister}>New Register</button>
        </div>
      {/if}
    </div>
    <RegistersCards registers={input_registers2} />
  {/if}
  <div>
    Runtime Registers
    <RegistersHold bind:registers={status.register} modeInput={false} />
  </div>
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

  div {
    align-content: space-around;
  }

  button:focus {
    border: 2px solid #ff3e00;
  }

  .collapse_frame {
    border-color: black;
    border-radius: 2em;
    border: 2px solid rgba(255, 62, 0, 0);
  }

  button:active {
    background-color: rgba(255, 62, 0, 0.2);
  }
</style>
