<script lang="ts">
  import { onMount } from "svelte";
  import { basicSetup } from "codemirror";
  import { EditorState, Compartment } from "@codemirror/state";
  import { keymap, EditorView } from "@codemirror/view";
  import { defaultKeymap, redo, undo } from "@codemirror/commands";
  import { openSearchPanel } from "@codemirror/search";
  import { oneDark } from "@codemirror/theme-one-dark";
  import { normaLanguage, normaLinter } from "../NormaLanguage";
  import { debugExtension, DebugHandler } from "../DebugExtension";
  import FileToolbar from "./FileToolbar.svelte";
  import { push, pop, replace } from "svelte-spa-router";
  import { urlPlugin } from "../urlPlugin";

  export let editor: EditorView | any;
  export let slim = false;
  export let fixedProgram = undefined;
  export let sugestedProgram = undefined;
  let readOnly = new Compartment();
  let dh: DebugHandler;
  let codeDiv;

  const handleUndo = () => {
    if (editor) {
      undo({
        state: editor.state,
        dispatch: editor.dispatch,
      });
    }
  };

  const handleRedo = () => {
    if (editor) {
      redo({
        state: editor.state,
        dispatch: editor.dispatch,
      });
    }
  };

  const handleSearch = () => {
    if (editor) {
      openSearchPanel(editor);
    }
  };

  const handleLoadExample = (example) => {
    fetch(example)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text();
      })
      .then((data) => {
        setValue(data);
        console.log(data);
      })
      .catch((error) => {
        console.error("Error loading file.", error);
      });
  };

  const menuItems = [
    {
      label: "Arquivo",
      items: [
        {
          label: "Novo",
          fn: () => setValue(""),
        },
        {
          label: "Salvar",
          fn: () => exportFile("programa.norma", editor.state.doc.toString()),
        },
        { label: "Carregar", fn: () => getFileFromUser() },
      ],
    },
    {
      label: "Edição",
      items: [
        { label: "Desfazer", fn: handleUndo },
        { label: "Refazer", fn: handleRedo },
        { label: "Procurar", fn: handleSearch },
      ],
    },
    {
      label: "Exemplos",
      items: [
        { label: "Adicionar", fn: () => handleLoadExample("add.norma") },
        {
          label: "Substrair",
          fn: () => handleLoadExample("dec.norma"),
        },
        {
          label: "Adicionar mantendo registrador",
          fn: () => handleLoadExample("addKeep.norma"),
        },
      ],
    },
    {
      label: "Ajuda",
      items: [
        { label: "Manual", fn: () => push("#/Manual") },
        {
          label: "Sobre",
          fn: () => push("#/Author"),
        },
      ],
    },
  ];

  function getFileFromUser() {
    // create a file input element
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".norma"; // accept only .norma files

    // add an event listener to the input element
    input.addEventListener("change", (event) => {
      const file = input.files[0];
      // do something with the file, such as upload it to a server
      console.log(file);
      // check if the file extension is .norma
      if (file && file.name.endsWith(".norma")) {
        const reader = new FileReader();
        // set up a callback function to handle the file contents
        reader.onload = (event) => {
          const contents = event.target.result;
          // do something with the file, such as upload it to a server
          setValue(contents);
        };
        // read the contents of the file as text
        reader.readAsText(file);
      } else {
        alert("Informe um arquivo com a extensão .norma");
      }
      // remove the input element from the DOM
      input.remove();
    });

    // click the input element to trigger the file selection dialog
    input.click();
  }

  function exportFile(defaultFilename, content) {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.style.display = "none";

    // prompt the user to choose the filename for the exported file
    let filename = prompt("Infome o nome", defaultFilename);
    if (filename) {
      if (!filename.endsWith(".norma")) filename = filename.concat(".norma");
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    URL.revokeObjectURL(url);
  }

  onMount(() => {
    const fixedHeightEditor = EditorView.theme({
      "&": { height: "100%" },
      ".cm-scroller": { overflow: "auto" },
    });
    let src = "";
    if (sugestedProgram !== undefined) {
      src = sugestedProgram;
    }
    if (fixedProgram !== undefined) {
      src = fixedProgram;
    }

    const state = EditorState.create({
      doc: src,
      extensions: [
        basicSetup,
        keymap.of(defaultKeymap),
        fixedHeightEditor,
        oneDark,
        normaLinter,
        readOnly.of(EditorState.readOnly.of(false)),
        normaLanguage(),
        debugExtension,
        EditorView.lineWrapping,
        urlPlugin,
        EditorView.contentAttributes.of({ spellcheck: "false" }),
        EditorView.contentAttributes.of({ "data-enable-grammarly": "false" }),
      ],
    });
    editor = new EditorView({
      state,
      parent: codeDiv,
    });
    dh = new DebugHandler(editor);

    editor.readOnlyMode = (enable) => {
      editor.dispatch({
        effects: readOnly.reconfigure(EditorState.readOnly.of(enable)),
      });
    };

    editor.clearExecution = () => {
      if (fixedProgram === undefined) {
        editor.readOnlyMode(false);
      }
      dh.clearCursorDebug();
    };

    editor.currentDebugLine = (line: number) => {
      dh.clearCursorDebug();
      dh.currentLine(line + 1);
    };

    editor.getValue = (): string => {
      return editor.state.doc.toString();
    };
    if (fixedProgram !== undefined) {
      editor.readOnlyMode(true);
    }
  });

  function setValue(value) {
    // update the editor's value programmatically
    editor.dispatch({
      changes: { from: 0, to: editor.state.doc.length, insert: value },
    });
  }
</script>

{#if !slim}
  <FileToolbar {menuItems} />
{/if}

<div bind:this={codeDiv} class="editor" class:slim />

<style>
  /* optional: customize the appearance of the editor */
  .editor {
    height: 70vh;
    font-size: 22px;
  }

  .editor.slim {
    height: auto;
  }
</style>
