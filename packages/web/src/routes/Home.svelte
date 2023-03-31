<script>
  import NormaFrame from "../lib/NormaCodeFrame.svelte";
  let manualUrl = window.location.origin + "/#/Manual";
  let defaultSrc =
    "// Utilizando a ferramenta pela primeira vez? \n// Acesse o manual para mais informações de como utilizar " +
    manualUrl;
  if (import.meta.env.DEV) {
    defaultSrc =
      "//coment\ninc a //inc blabla\ndec b\nifz a (5,end)\ndec a (3)\nend:";
  }
</script>

<div class="Frame">
  <NormaFrame sugestedProgram={defaultSrc} />
</div>
