<script lang="ts">
  import Frame from "./Frame.svelte";
  import CodeMirror from "./CodeMirror6.svelte";
  import Executer from "./Executer.svelte";
  import { NormaInstance } from "norma-lab-wasm";
  export let slim = false;
  export let fixedProgram = undefined;
  export let sugestedProgram = undefined;
  let editor = null;
  let x = NormaInstance.new();
</script>

<div class="Frame">
  <Frame>
    <div class="code" slot="code-view">
      <CodeMirror bind:editor {slim} {fixedProgram} {sugestedProgram} />
    </div>
    <div class="exec" slot="execution-view">
      <Executer {editor} normaInstance={x} {slim} />
    </div>
  </Frame>
</div>

<style>
  .exec {
    text-align: center;
    min-width: max-content;
  }
</style>
