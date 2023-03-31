<script>
  import NormaFrame from "../lib/NormaCodeFrame.svelte";
  let manualUrl = window.location.href.split("#")[0] + "#/Manual";

  let defaultSrc =
    "// Utilizando a ferramenta pela primeira vez? \n// Para mais informações acesse o manual " +
    manualUrl;
  if (import.meta.env.DEV) {
    defaultSrc +=
      "\n//coment\ninc a //inc blabla\ninc b\ninc b\nifz a (end,8)\ndec a (5)\nend:";
  }
</script>

<div class="Frame">
  <NormaFrame sugestedProgram={defaultSrc} />
</div>
