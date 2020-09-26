<script lang="ts">
  import { workspaceStore } from "./stores";
  import { parseUserInput } from "../logic/parser";
  import type { Expression } from "../logic/parser";

  export let clearOnFinish: boolean = false;
  export let current: Expression;

  let rawInput = current ? current.stringified : "";
  let unsavedEdition: boolean = false;
  let lastStringified = rawInput;
  let error = "";

  $: {
    if (!unsavedEdition && current && current.stringified !== lastStringified) {
      rawInput = current.stringified;
      lastStringified = current.stringified;
    }
  }

  function parseIfIsEnter({ code }: KeyboardEvent): void {
    // FIXME: mathjs is case-insensitive
    const trimmedInput = rawInput.trim();

    if (current) {
      unsavedEdition = true;
    }

    if (code !== "Enter" || trimmedInput.length === 0) {
      return;
    }

    error = "";
    const parsedResult = parseUserInput(trimmedInput);

    if (parsedResult.hasError === true) {
      // TODO: Flash input to show error
      error = parsedResult.message;
      return;
    }

    if (current && current.identifier !== parsedResult.result.identifier) {
      workspaceStore.replaceByUserInput(trimmedInput, current.identifier);
    } else {
      workspaceStore.addUserInput(trimmedInput);
    }

    unsavedEdition = false;

    if (clearOnFinish) {
      rawInput = "";
    }
  }
</script>

<style>
  input {
    width: 100%;
    border: 0;
    outline: 0px;
    padding: 4px 0;
    border-bottom: 1px dashed purple;
    margin-bottom: 0px;
  }

  input:focus {
    border-bottom: 2px solid purple;
    padding-bottom: 3px;
    background-color: #fcf4fa;
  }

  .unsaved {
    font-style: italic;
  }

  .error {
    color: tomato;
  }
</style>

<div class="container">
  <input
    type="text"
    placeholder="Insira uma fórmula. Ex: A = B + C"
    bind:value={rawInput}
    on:keypress={parseIfIsEnter}
    class:unsaved={unsavedEdition} />

  <small class="error">{error}</small>
</div>
