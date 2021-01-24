<script lang="ts">
  import { expressionStore } from "./stores";
  import { errorCodes } from "../services/parsingErrors";
  import { parseUserInput, getErrorsFromParsing } from "../services/parseUserInput";
  import type { Expression } from "../services/parseUserInput";

  export let clearOnFinish: boolean = false;
  export let current: Expression;

  let rawInput = current ? current.stringified : "";
  let unsaved: boolean = false;
  let lastStringified = rawInput;
  let error = "";

  $: {
    if (!unsaved && current && current.stringified !== lastStringified) {
      rawInput = current.stringified;
      lastStringified = current.stringified;
    }
  }

  function parseIfIsEnter({ code }: KeyboardEvent): void {
    // FIXME: mathjs is case-insensitive
    const trimmedInput = rawInput.trim();

    if (current) {
      unsaved = true;
    }

    if (code !== "Enter" || trimmedInput.length === 0) {
      return;
    }

    error = '';
    const codes = getErrorsFromParsing(trimmedInput);
    if (codes.length > 0) {
      // TODO: Flash input to show error
      error = codes.map(errorCodeToMessage).join();
      return;
    }

    const parsedResult = parseUserInput(trimmedInput);

    expressionStore.addOrUpdate(parsedResult);

    unsaved = false;

    if (clearOnFinish) {
      rawInput = "";
    }
  }

  function errorCodeToMessage (code: number) {
    const messageByCode = {
      [errorCodes.dependsOnItself]: 'O literal depende dele mesmo',
      [errorCodes.invalidExpression]: 'Expressão inválida',
      [errorCodes.isNotAssignment]: 'A expressão precisa ser uma definição de símbolo, como em "A = 10"',
    };

    return messageByCode[code];
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
    class:unsaved />

  <small class="error">{error}</small>
</div>
