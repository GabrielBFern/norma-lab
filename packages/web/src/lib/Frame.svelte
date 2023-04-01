<script>
  let _class = "";
  export let style = "";
  export let mode = false;
  export let slider = 65;
  export let slider_max = 99;
  export let slider_min = 25;
  export let title_code = "Code";
  export let title_execution = "Execution";
  export { _class as class };
  let legend_element;
  let parent_element;
  /**
   * Handles updating the position of the slider between the content views
   */
  function on_mouse_move(event) {
    // If grabbing mode is not enabled, skip
    if (!mode) return;
    const { clientWidth } = parent_element;
    const mouse_x = event.pageX - parent_element.offsetLeft;
    slider = Math.max(
      Math.min((mouse_x / clientWidth) * 100, slider_max),
      slider_min
    );
  }
  $: height_style = legend_element
    ? `height:calc(100% - ${legend_element.clientHeight}px)`
    : "";
  $: mode_class = mode ? "sr-horizontal-frame--grabbing" : "";
</script>

<div
  class="sr-horizontal-frame {mode_class}
    {_class}"
  bind:this={parent_element}
  on:mousemove={on_mouse_move}
  on:mouseup={() => (mode = false)}
  {style}
>
  <fieldset class="sr-horizontal-frame--container" style="width:{slider}%;">
    <legend bind:this={legend_element}>{title_code}</legend>

    <div class="sr-horizontal-frame--view" style={height_style}>
      <slot name="code-view" />
    </div>
  </fieldset>

  <div class="sr-horizontal-frame--slider" on:mousedown={() => (mode = true)}>
    &harr;
  </div>

  <fieldset
    class="sr-horizontal-frame--container"
    style="width:{100 - slider}%;"
  >
    <legend>{title_execution}</legend>

    <div class="sr-horizontal-frame--view" style={height_style}>
      <slot name="execution-view" />
    </div>
  </fieldset>
</div>

<style>
  .sr-horizontal-frame {
    display: flex;
    align-items: stretch;
    position: relative;
  }
  .sr-horizontal-frame.sr-horizontal-frame--grabbing,
  .sr-horizontal-frame.sr-horizontal-frame--grabbing
    > .sr-horizontal-frame--slider {
    cursor: grabbing;
  }
  .sr-horizontal-frame.sr-horizontal-frame--grabbing
    > .sr-horizontal-frame--container {
    pointer-events: none;
    user-select: none;
  }
  .sr-horizontal-frame--slider {
    display: flex;
    align-items: center;
    margin-left: -0.9rem;
    margin-right: -0.9rem;
    font-size: 2rem;
    font-weight: bold;
    cursor: grab;
    user-select: none;
    z-index: 1;
  }
  .sr-horizontal-frame--view,
  .sr-horizontal-frame--view > :global(*[slot="code-view"]) {
    width: 100%;
    height: 100%;
  }

  @media (max-width: 899px) {
    .sr-horizontal-frame {
      align-items: center;
      flex-direction: column;
    }

    .sr-horizontal-frame--container {
      width: calc(100% - 5rem) !important;
    }

    .sr-horizontal-frame--slider {
      display: none;
    }
  }
</style>
